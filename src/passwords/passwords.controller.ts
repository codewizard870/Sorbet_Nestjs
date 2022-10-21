import { Controller } from '@nestjs/common';
import { PasswordsService } from './passwords.service';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}
}
