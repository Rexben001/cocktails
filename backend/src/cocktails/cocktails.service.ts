import {
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { handleDatabaseError } from './cocktails.utils';
import { CreateCocktail } from './create-cocktail.dto';
import { ElasticSearch } from '../elasticsearch.service';

@Injectable()
export class CocktailsService {
    constructor(
        @InjectRepository(Cocktails)
        private cocktailsRepository: Repository<Cocktails>,
        @Inject(forwardRef(() => ElasticSearch))
        private readonly elasticSearchService: ElasticSearch,
    ) {}

    findAll(): Promise<Cocktails[]> {
        return this.cocktailsRepository.find();
    }

    async findOne(id: number): Promise<Cocktails> {
        const cocktail = await this.cocktailsRepository.findOneBy({ id });
        if (!cocktail) throw new NotFoundException('Cocktail not found');
        return cocktail;
    }

    async create(cocktail: CreateCocktail): Promise<void> {
        try {
            const createdCocktail =
                await this.cocktailsRepository.insert(cocktail);
            const cocktailId = createdCocktail.identifiers[0].id;

            await this.elasticSearchService.indexCocktail({
                ...cocktail,
                id: cocktailId,
            });
            return;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    async search(query: string): Promise<Cocktails[]> {
        return this.elasticSearchService.fuzzySearch(query);
    }
}
