import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqueActionsService } from './historique-actions.service';
import { HistoriqueActionRepository } from './historique-actions.repository';

describe('HistoriqueActionsService', () => {
  let service: HistoriqueActionsService;

  beforeEach(async () => {
    const repoMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoriqueActionsService,
        {
          provide: HistoriqueActionRepository,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<HistoriqueActionsService>(HistoriqueActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
