import { Test, TestingModule } from '@nestjs/testing';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';

describe('CursosController', () => {
  let controller: CursosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosController],
      providers: [CursosService],
    }).compile();

    controller = module.get<CursosController>(CursosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
