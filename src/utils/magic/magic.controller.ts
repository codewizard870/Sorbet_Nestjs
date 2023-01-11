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
  import { Public } from "../auth/constants";
  import { ApiTags } from "@nestjs/swagger";
  import { Magic } from '@magic-sdk/admin';
import { MagicAuthGuard } from "./magic.guard";

  const magic = new Magic(process.env.MAGIC_SECRET_KEY);

  @ApiTags("auth")
  @Controller("/api/auth")
  export class MagicController {

    @Public()
    @UseGuards(MagicAuthGuard)
    @Post("login-magic")
    async login(@Request() req, @Response() res) {
        if (req.user) {
            res.status(HttpStatus.OK).end('User is logged in.');
        } 
        else {
            return res.status(HttpStatus.UNAUTHORIZED).end('Could not log user in.');
            // throw new UnauthorizedException()
        }
    }
  
    @Public()
    @Get('getAll')
    async getAll(@Request() req, @Response() res) {
        if (req.isAuthenticated()) {
            return res
              .status(HttpStatus.OK)
              .json(req.user)
              .end();
        } 
        else {
            return res.status(HttpStatus.UNAUTHORIZED).end(`Could not log user in.`);
            // throw new UnauthorizedException()
        }
    }

    @Public()
    @Post('logout-magic')
    async logout(@Request() req, @Response() res) {
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()) {
            await magic.users.logoutByIssuer(req.user.issuer);
            req.logout();
            return res.status(HttpStatus.OK).end();
        } 
        else {
            console.log(req)
            return res.status(HttpStatus.UNAUTHORIZED).end(`Could not log user in.`);
            // throw new UnauthorizedException()
        }
    } 
}
  