/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException ,BadRequestException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    //super();
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(email, password);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException ({message: "We couldn't find an account with this email. Please try again."});
    }
    if (user.status === "Pending") {
      return new UnauthorizedException({message:"Pending Account. Please Verify Your Email!"}) 
    }
    if (user.status !== "Active") {
      return new UnauthorizedException({message:"Unauthorized!"})
    }

    return user;
  }
}
