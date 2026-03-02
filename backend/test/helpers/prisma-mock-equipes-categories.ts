import { PrismaService } from 'src/prisma/prisma.service';

type Equipe = { id_equipe: string; nom: string };
type Categorie = { id_categorie: string; libelle: string; id_equipe: string };

export function creerMockPrismaEquipesCategories(): PrismaService {
  const equipes = new Map<string, Equipe>();
  const categories = new Map<string, Categorie>();

  const prismaLike = {
    equipes: {
      create: async ({ data }: any) => {
        const entity: Equipe = { id_equipe: data.id_equipe, nom: data.nom };
        equipes.set(entity.id_equipe, entity);
        return entity;
      },
      findMany: async () => Array.from(equipes.values()),
      findUnique: async ({ where }: any) => equipes.get(where.id_equipe) ?? null,
      update: async ({ where, data }: any) => {
        const existing = equipes.get(where.id_equipe);
        if (!existing) throw new Error('Equipe introuvable');
        const updated: Equipe = {
          ...existing,
          ...(data.nom !== undefined ? { nom: data.nom } : null),
        };
        equipes.set(where.id_equipe, updated);
        return updated;
      },
      delete: async ({ where }: any) => {
        const existing = equipes.get(where.id_equipe);
        if (!existing) throw new Error('Equipe introuvable');
        equipes.delete(where.id_equipe);
        return existing;
      },
    },

    categories: {
      create: async ({ data }: any) => {
        const id_equipe = data.equipes?.connect?.id_equipe ?? data.id_equipe;
        if (!id_equipe) throw new Error('id_equipe requis');
        if (!equipes.has(id_equipe)) throw new Error('Equipe inconnue');

        const entity: Categorie = {
          id_categorie: data.id_categorie,
          libelle: data.libelle,
          id_equipe,
        };
        categories.set(entity.id_categorie, entity);
        return entity;
      },
      findMany: async () => Array.from(categories.values()),
      findUnique: async ({ where }: any) =>
        categories.get(where.id_categorie) ?? null,
      update: async ({ where, data }: any) => {
        const existing = categories.get(where.id_categorie);
        if (!existing) throw new Error('Catégorie introuvable');

        const updated: Categorie = {
          ...existing,
          ...(data.libelle !== undefined ? { libelle: data.libelle } : null),
        };

        categories.set(where.id_categorie, updated);
        return updated;
      },
      delete: async ({ where }: any) => {
        const existing = categories.get(where.id_categorie);
        if (!existing) throw new Error('Catégorie introuvable');
        categories.delete(where.id_categorie);
        return existing;
      },
    },
  };

  return prismaLike as any as PrismaService;
}
