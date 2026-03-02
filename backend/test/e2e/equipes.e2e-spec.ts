import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { creerAppDeTest } from '../helpers/test-app';
import { creerMockPrismaEquipesCategories } from '../helpers/prisma-mock-equipes-categories';

describe('Routes /equipes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await creerAppDeTest(creerMockPrismaEquipesCategories());
  });

  afterAll(async () => {
    await app?.close();
  });

  it('CRUD minimal', async () => {
    const id_equipe = `e2e_equipe_${randomUUID()}`;
    const nom = 'Equipe E2E';

    const createRes = await request(app.getHttpServer())
      .post('/equipes')
      .send({ id_equipe, nom })
      .expect(201);

    expect(createRes.body).toMatchObject({ id_equipe, nom });

    const getRes = await request(app.getHttpServer())
      .get(`/equipes/${id_equipe}`)
      .expect(200);

    expect(getRes.body).toMatchObject({ id_equipe, nom });

    const nom2 = 'Equipe E2E (maj)';
    await request(app.getHttpServer())
      .patch(`/equipes/${id_equipe}`)
      .send({ nom: nom2 })
      .expect(200);

    const getRes2 = await request(app.getHttpServer())
      .get(`/equipes/${id_equipe}`)
      .expect(200);

    expect(getRes2.body).toMatchObject({ id_equipe, nom: nom2 });

    await request(app.getHttpServer())
      .delete(`/equipes/${id_equipe}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/equipes/${id_equipe}`)
      .expect(404);
  });
});
