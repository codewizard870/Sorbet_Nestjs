import {
    Controller,
    Get,
    Request,
    Response,
    Post,
    UseGuards,
    HttpStatus,
    UnauthorizedException
  } from "@nestjs/common";
  import { AuthGuard } from "@nestjs/passport";
  import { Public } from "../auth/constants";
  import { ApiTags } from "@nestjs/swagger";
  import * as Datastore from 'nedb-promise';
  import { Magic } from '@magic-sdk/admin';
  import { Strategy } from 'passport-local';
  import { PassportStrategy } from '@nestjs/passport';
  import * as passport from 'passport'
  import { Strategy as MagicStrategy } from 'passport-magic'

  let users = new Datastore({ filename: "users.db", autoload: true });
  const magic = new Magic(process.env.MAGIC_SECRET_KEY);

  // Magic Auth user signup
  const signup = async (user: any, userMetadata: any, done: any) => {
    let newUser = {
      issuer: user.issuer,
      email: userMetadata.email,
      lastLoginAt: user.claim.iat
    };
    await users.insert(newUser);
    return done(null, newUser);
  };
  
  // Magic Auth user login
  const login = async (user: any, done: any) => {
    /* Replay attack protection (https://go.magic.link/replay-attack) */
    if (user.claim.iat <= user.lastLoginAt) {
      return done(null, false, {
        message: `Replay attack detected for user ${user.issuer}}.`
      });
    }
    await users.update(
      { issuer: user.issuer },
      { $set: { lastLoginAt: user.claim.iat } }
    );
    return done(null, user);
  };

  const strategy = new MagicStrategy(async function(user: any, done) {
    const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
    const existingUser = await users.findOne({ issuer: user.issuer });
    if (!existingUser) {
      /* Create new user if doesn't exist */
      return signup(user, userMetadata, done);
    } else {
      /* Login user if otherwise */
      return login(user, done);
    }
  });

  passport.use(strategy);

  /* Defines what data are stored in the user session */
  passport.serializeUser((user: any, done) => {
    done(null, user /*.issuer*/);
  });
  
  /* Populates user data in the req.user object */
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await users.findOne({ issuer: id });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  @ApiTags("auth")
  @Controller("/api/auth")
  export class MagicController extends PassportStrategy(Strategy, 'magic') {
    constructor() {
        super();
      }

    @Public()
    @UseGuards(AuthGuard('magic'))
    @Post("login-magic")
    async login(@Request() req, @Response() res) {
        console.log('REQUEST', req)
        if (req.user) {
            res.status(HttpStatus.OK).end('User is logged in.');
        } 
        else {
            return res.status(HttpStatus.UNAUTHORIZED).end('Could not log user in.');
            // throw new UnauthorizedException()
        }
    }
  
    @Public()
    @Get('')
    async getAll(@Request() req, @Response() res) {
        if (req.isAuthenticated()) {
            return res
              .status(HttpStatus.OK)
              .json(req.user)
              .end();
        } 
        else {
            return res.status(HttpStatus.UNAUTHORIZED).end(`User is not logged in.`);
            // throw new UnauthorizedException()
        }
    }

    @Public()
    @Post('logout-magic')
    async logout(@Request() req, @Response() res) {
        if (req.isAuthenticated()) {
            await magic.users.logoutByIssuer(req.user.issuer);
            req.logout();
            return res.status(HttpStatus.OK).end();
        } 
        else {
            return res.status(HttpStatus.UNAUTHORIZED).end(`User is not logged in.`);
            // throw new UnauthorizedException()
        }
    } 
}
  