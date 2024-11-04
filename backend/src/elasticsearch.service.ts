import {
    Inject,
    Injectable,
    forwardRef,
    type OnModuleInit,
} from '@nestjs/common';

import { Client as EsClient } from '@elastic/elasticsearch';
import type { Cocktails } from './cocktails/cocktails.entity';
import type { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { CocktailsService } from './cocktails/cocktails.service';

@Injectable()
export class ElasticSearch implements OnModuleInit {
    private readonly client: EsClient;
    private readonly index: string;

    constructor(
        @Inject(forwardRef(() => CocktailsService))
        private readonly cocktailsService: CocktailsService,
    ) {
        this.index = 'cocktails';
        this.client = new EsClient({ node: process.env.ELASTICSEARCH_HOST });
    }

    async onModuleInit() {
        await this.initializeElasticSearch();
    }

    private async initializeElasticSearch() {
        await this.checkConnection();
        await this.syncDatabaseToElasticsearch();
    }

    private async checkConnection(): Promise<void> {
        try {
            const isAlive = await this.client.ping();
            console.log('Elasticsearch cluster is up and running:', isAlive);
        } catch (error) {
            console.error('Elasticsearch cluster is down!', error);
            throw new Error('Elasticsearch connection failed');
        }
    }

    async fuzzySearch(searchQuery: string): Promise<Cocktails[]> {
        const result = await this.client.search({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        fields: ['title', 'description'],
                        query: searchQuery,
                        fuzziness: 'AUTO',
                    },
                },
            },
        });

        return this.extractCocktailsFromHits(result.hits.hits);
    }

    async syncDatabaseToElasticsearch(): Promise<void> {
        const cocktails = await this.cocktailsService.findAll();

        const indexingPromises = cocktails.map((cocktail) =>
            this.indexCocktail(cocktail),
        );

        await Promise.all(indexingPromises);
        console.log('Database synchronized with Elasticsearch');
    }

    async indexCocktail(cocktail: Cocktails): Promise<void> {
        await this.client.index({
            index: this.index,
            id: cocktail.id.toString(),
            document: cocktail,
        });
        console.log(`Indexed cocktail: ${cocktail.title}`);
    }

    private extractCocktailsFromHits(hits: SearchHit<unknown>[]): Cocktails[] {
        return hits.map((hit) => hit._source) as Cocktails[];
    }
}
