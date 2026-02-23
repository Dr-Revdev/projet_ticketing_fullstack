import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqueActionsService } from './historique-actions.service';

describe('HistoriqueActionsService', () => {
  let service: HistoriqueActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoriqueActionsService],
    }).compile();

    service = module.get<HistoriqueActionsService>(HistoriqueActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
