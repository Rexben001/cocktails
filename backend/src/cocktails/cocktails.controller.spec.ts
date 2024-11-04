import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Cocktails } from './cocktails.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CocktailsModule } from './cocktails.module';
import { ElasticSearch } from '../elasticsearch.service';

describe('CocktailsController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    url: process.env.DATABASE_URL,
                    type: 'postgres',
                    logging: false,
                    entities: [Cocktails],
                }),
                CocktailsModule,
            ],
            providers: [ElasticSearch],
        }).compile();

        app = module.createNestApplication();

        app.useGlobalPipes(new ValidationPipe());

        await app.init();

        const elasticSearchService = app.get(ElasticSearch);
        await elasticSearchService.syncDatabaseToElasticsearch();

        // wait for syncDatabaseToElasticsearch completion
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /cocktails', () => {
        const getCocktailsRequest = async () =>
            request(app.getHttpServer()).get('/cocktails');

        it('should get all cocktails', async () => {
            const response = await getCocktailsRequest();

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.length).toBe(15);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(15);
        });
    });
    describe('GET /cocktails/search?q', () => {
        const searchCocktailsRequest = async (query: string) =>
            request(app.getHttpServer()).get(`/cocktails/search?q=${query}`);

        it('should fuzzy search for Mojito', async () => {
            const response = await searchCocktailsRequest('Mojito');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.length).toBe(2);
            expect(response.body).toEqual([
                expect.objectContaining({
                    id: 6,
                    title: 'Nojito',
                    description: expect.any(String),
                    price: expect.any(String),
                }),
                expect.objectContaining({
                    id: 1,
                    title: 'Virgin Mojito',
                    description: expect.any(String),
                    price: expect.any(String),
                }),
            ]);
        });

        it('should return an empty array for Mango', async () => {
            const response = await searchCocktailsRequest('Mango');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual([]);
        });
    });

    describe('GET /cocktails/:id', () => {
        const getCocktailByIdRequest = async (id: string) =>
            request(app.getHttpServer()).get(`/cocktails/${id}`);

        it('should return a specific cocktail by ID', async () => {
            const response = await getCocktailByIdRequest('2');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({
                id: 2,
                title: 'Shirley Temple',
                description: expect.any(String),
                price: '3.75',
            });
        });

        it('should return 404 for a non-existent cocktail', async () => {
            const response = await getCocktailByIdRequest('200000');

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('POST /cocktails', () => {
        const createNewCocktailsRequest = async (payload: {
            title?: string;
            price?: number;
            description?: string;
        }) => {
            return request(app.getHttpServer())
                .post('/cocktails')
                .send({
                    ...payload,
                });
        };

        it('should add a new cocktail', async () => {
            const response = await createNewCocktailsRequest({
                description: 'A non-alcoholic version of the classic Mojito.',
                price: 4,
                title: 'New Cocktail0',
            });

            expect(response.status).toBe(HttpStatus.CREATED);
        });

        it('should return 409 for duplicate title', async () => {
            const response = await createNewCocktailsRequest({
                description: 'A non-alcoholic version of the classic Mojito.',
                price: 40,
                title: 'New Cocktail0',
            });

            expect(response.status).toBe(HttpStatus.CONFLICT);
        });

        it('should return 400 for invalid data', async () => {
            const response = await createNewCocktailsRequest({
                price: -10,
                title: '',
            });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body.message).toEqual(
                expect.arrayContaining([
                    'title should not be empty',
                    'description must be a string',
                    'price must be a positive number',
                ]),
            );
        });
    });
});
