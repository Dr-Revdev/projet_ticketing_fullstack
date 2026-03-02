import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { creerAppDeTest } from '../helpers/test-app';
import { creerMockPrismaEquipesCategories } from '../helpers/prisma-mock-equipes-categories';

describe('Routes /categories (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await creerAppDeTest(creerMockPrismaEquipesCategories());
  });

  afterAll(async () => {
    await app?.close();
  });

  it('CRUD minimal', async () => {
    const id_equipe = `e2e_equipe_${randomUUID()}`;
    await request(app.getHttpServer())
      .post('/equipes')
      .send({ id_equipe, nom: 'Equipe pour categorie' })
      .expect(201);

    const id_categorie = `e2e_cat_${randomUUID()}`;
    const libelle = 'Catégorie E2E';

    const createRes = await request(app.getHttpServer())
      .post('/categories')
      .send({ id_categorie, libelle, id_equipe })
      .expect(201);

    expect(createRes.body).toMatchObject({ id_categorie, libelle });

    const getRes = await request(app.getHttpServer())
      .get(`/categories/${id_categorie}`)
      .expect(200);

    expect(getRes.body).toMatchObject({ id_categorie, libelle });

    const libelle2 = 'Catégorie E2E (maj)';
    await request(app.getHttpServer())
      .patch(`/categories/${id_categorie}`)
      .send({ libelle: libelle2 })
      .expect(200);

    const getRes2 = await request(app.getHttpServer())
      .get(`/categories/${id_categorie}`)
      .expect(200);

    expect(getRes2.body).toMatchObject({ id_categorie, libelle: libelle2 });

    await request(app.getHttpServer())
      .delete(`/categories/${id_categorie}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/categories/${id_categorie}`)
      .expect(404);
  });
});
