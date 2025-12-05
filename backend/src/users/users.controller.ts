import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  PaginatedResponse,
  SingleResponse,
} from '../common/interfaces/response.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<SingleResponse<any>> {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }

  @Get()
  async findAll(): Promise<PaginatedResponse<any>> {
    return await this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@Request() req): Promise<SingleResponse<any>> {
    const user = await this.usersService.getProfile(req.user.userId);
    return { data: user };
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<SingleResponse<any>> {
    const user = await this.usersService.updateProfile(
      req.user.userId,
      updateProfileDto,
    );
    return { data: user };
  }
}
