import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TicketRepository } from './tickets.repository';
import { AccessService } from '../access/access.service';
import { HistoriqueActionsService } from '../historique-actions/historique-actions.service';


describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const repoMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    const accessMock = {
      getUserContext: jest.fn(),
      hasAtLeast: jest.fn(),
      isAdmin: jest.fn(),
      ticketWhereFor: jest.fn(),
      assertCanReadTicket: jest.fn(),
      getTicketForAccess: jest.fn(),
      canReadTicketFromLoaded: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: TicketRepository,
          useValue: repoMock,
        },
        {
          provide: AccessService,
          useValue: accessMock,
        },
        {
          provide: HistoriqueActionsService,
          useValue: { create: jest.fn() },
        }
      ],
    },).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
