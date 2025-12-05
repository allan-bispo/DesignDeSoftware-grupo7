import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateThematicAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;
}
