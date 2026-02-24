import { Test, TestingModule } from '@nestjs/testing';
import { PieceJointesController } from './piece-jointes.controller';
import { PieceJointesService } from './piece-jointes.service';

describe('PieceJointesController', () => {
  let controller: PieceJointesController;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PieceJointesController],
      providers: [
        {
          provide: PieceJointesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<PieceJointesController>(PieceJointesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
