import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { MessageRepository } from './message.repository';

describe('MessagesService', () => {
  let service: MessagesService;

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
        MessagesService,
        {
          provide: MessageRepository,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
