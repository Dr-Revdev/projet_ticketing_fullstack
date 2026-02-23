import { Test, TestingModule } from '@nestjs/testing';
import { PieceJointesService } from './piece-jointes.service';

describe('PieceJointesService', () => {
  let service: PieceJointesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PieceJointesService],
    }).compile();

    service = module.get<PieceJointesService>(PieceJointesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
