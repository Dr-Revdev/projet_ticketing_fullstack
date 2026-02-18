import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
    {
        constructor() {
            const databaseUrl = process.env.DATABASE_URL;
            if(!databaseUrl) {
                throw new Error('DATABASE_URL manquant ou incorrect')
            }
            const url = new URL(databaseUrl);
            const schema = url.pathname.replace(/^\//, '');

            const adapter = new PrismaMariaDb(
                {
                    host: url.hostname,
                    port: Number(url.port || 3306),
                    user: decodeURIComponent(url.username),
                    password: decodeURIComponent(url.password),
                    connectionLimit: 5,
                },
                { database: schema },
            );

            super({ adapter,
                log: ['query', 'info', 'warn', 'error'], // Debug, visualisation SQL
             });
        }
        async onModuleInit() {
            await this.$connect();
        }

        async onModuleDestroy() {
            await this.$disconnect();
        }
    }
