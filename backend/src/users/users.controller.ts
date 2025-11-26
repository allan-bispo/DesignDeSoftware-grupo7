import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginatedResponse } from '../common/interfaces/response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<PaginatedResponse<any>> {
    return await this.usersService.findAll();
  }
}
