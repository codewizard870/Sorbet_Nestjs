import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Strategy as MagicStrategy } from 'passport-magic'
import { Magic } from '@magic-sdk/admin';
import * as Datastore from 'nedb-promise';
import * as passport from 'passport'

let users = new Datastore()
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

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'magic') {
    constructor() {
        super()
    }
    async validate(): Promise<any> {
        const strategy = new MagicStrategy(async function(user: any, done) {
            console.log(" Strategy!")
            const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
            const existingUser = await users.findOne({ issuer: user.issuer });
            if (!existingUser) {
              return signup(user, userMetadata, done);
            } 
            else {
              return login(user, done);
            }
        });
        return strategy
    }
}