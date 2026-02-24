import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TicketRepository } from './tickets.repository';

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: TicketRepository,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
