import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UtilisateurRepository } from '../utilisateurs/utilisateurs.repository';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const repoMock = {
      findAuthByEmail: jest.fn(),
      touchDerniereConnexion: jest.fn(),
    };

    const jwtMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UtilisateurRepository,
          useValue: repoMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
