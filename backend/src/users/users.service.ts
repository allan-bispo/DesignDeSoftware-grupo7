import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar se o email já existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Criar usuário
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Retornar sem a senha
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'avatar', 'phone', 'department', 'isActive'],
    });

    return {
      data: users,
      pagination: {
        page: 1,
        limit: users.length,
        total: users.length,
        totalPages: 1,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'name',
        'email',
        'role',
        'avatar',
        'phone',
        'department',
        'bio',
        'specializations',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Atualizar campos permitidos
    if (updateProfileDto.name !== undefined) {
      user.name = updateProfileDto.name;
    }
    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.department !== undefined) {
      user.department = updateProfileDto.department;
    }
    if (updateProfileDto.bio !== undefined) {
      user.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.specializations !== undefined) {
      user.specializations = updateProfileDto.specializations;
    }
    if (updateProfileDto.avatar !== undefined) {
      user.avatar = updateProfileDto.avatar;
    }

    const updatedUser = await this.userRepository.save(user);

    // Retornar sem a senha
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
