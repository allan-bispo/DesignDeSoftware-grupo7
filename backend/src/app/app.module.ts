import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Módulos Existentes (legacy - serão gradualmente substituídos)
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { LibraryModule } from '../library/library.module';

// Módulos AKCIT - Nova Arquitetura
import { UsersModule } from '../users/users.module';
import { PedagogicalProjectModule } from '../pedagogical-project/pedagogical-project.module';
import { TeamManagementModule } from '../team-management/team-management.module';
import { ContentProductionModule } from '../content-production/content-production.module';
import { AvaManagementModule } from '../ava-management/ava-management.module';
import { StudentInteractionModule } from '../student-interaction/student-interaction.module';
import { EventsModule } from '../events/events.module';
import { CertificatesModule } from '../certificates/certificates.module';
import { EmailModule } from '../email/email.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.getOrThrow<string>('DATABASE_TYPE') as 'sqlite',
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true, // ATENÇÃO: Desabilitar em produção
      }),
    }),

    // Módulos Legacy (manter temporariamente para compatibilidade)
    AuthModule,
    CoursesModule,
    LibraryModule,

    // Módulos AKCIT
    UsersModule,
    PedagogicalProjectModule,
    TeamManagementModule,
    ContentProductionModule,
    AvaManagementModule,
    StudentInteractionModule,
    EventsModule,
    CertificatesModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
