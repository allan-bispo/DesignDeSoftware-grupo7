import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { CertificateTemplate } from './entities/certificate-template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, CertificateTemplate]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class CertificatesModule {}
