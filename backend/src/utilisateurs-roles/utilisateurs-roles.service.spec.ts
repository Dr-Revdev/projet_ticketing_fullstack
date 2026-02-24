import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateursRolesService } from './utilisateurs-roles.service';
import { UtilisateursRolesRepository } from './utilisateurs-roles.repository';

describe('UtilisateursRolesService', () => {
  let service: UtilisateursRolesService;

  beforeEach(async () => {
    const repoMock = {
      assign: jest.fn(),
      unassign: jest.fn(),
      listForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilisateursRolesService,
        {
          provide: UtilisateursRolesRepository,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<UtilisateursRolesService>(UtilisateursRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
