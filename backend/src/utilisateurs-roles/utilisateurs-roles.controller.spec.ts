import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateursRolesController } from './utilisateurs-roles.controller';
import { UtilisateursRolesService } from './utilisateurs-roles.service';

describe('UtilisateursRolesController', () => {
  let controller: UtilisateursRolesController;

  beforeEach(async () => {
    const serviceMock = {
      listRoles: jest.fn(),
      assignRole: jest.fn(),
      unassignRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilisateursRolesController],
      providers: [
        {
          provide: UtilisateursRolesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UtilisateursRolesController>(
      UtilisateursRolesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
