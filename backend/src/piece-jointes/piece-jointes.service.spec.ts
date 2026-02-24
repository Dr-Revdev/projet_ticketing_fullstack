import { Test, TestingModule } from '@nestjs/testing';
import { PieceJointesService } from './piece-jointes.service';
import { PieceJointeRepository } from './piece-jointes.repository';

describe('PieceJointesService', () => {
  let service: PieceJointesService;

  beforeEach(async () => {
    const repoMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PieceJointesService,
        {
          provide: PieceJointeRepository,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<PieceJointesService>(PieceJointesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
