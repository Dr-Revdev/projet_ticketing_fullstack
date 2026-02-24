import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqueActionsController } from './historique-actions.controller';
import { HistoriqueActionsService } from './historique-actions.service';

describe('HistoriqueActionsController', () => {
  let controller: HistoriqueActionsController;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriqueActionsController],
      providers: [
        {
          provide: HistoriqueActionsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<HistoriqueActionsController>(
      HistoriqueActionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
