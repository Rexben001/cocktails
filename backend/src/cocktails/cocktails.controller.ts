import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';
import {
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateCocktail } from './create-cocktail.dto';
import { ErrorResponse } from './cocktails.error-response.dto';

@ApiTags('cocktails')
@Controller('cocktails')
export class CocktailsController {
    constructor(private readonly cocktailsService: CocktailsService) {}

    @Get()
    @ApiOkResponse({ description: 'Returns all cocktails' })
    async getCocktails(): Promise<Cocktails[]> {
        return this.cocktailsService.findAll();
    }

    @Post()
    @ApiOkResponse({ description: 'Cocktail successfully created' })
    @ApiConflictResponse({
        description: 'Cocktail with the same title already exists',
        type: ErrorResponse,
    })
    async newCocktail(@Body() cocktail: CreateCocktail) {
        console.log('info: creating cocktail', cocktail);
        return this.cocktailsService.create(cocktail);
    }

    @Get('/search')
    @ApiOkResponse({ description: 'Returns search results' })
    async searchCocktails(
        @Query('q') queryString: string,
    ): Promise<Cocktails[]> {
        return this.cocktailsService.search(queryString);
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Cocktail successfully retrieved',
        type: Cocktails,
    })
    @ApiNotFoundResponse({
        description: 'Cocktail not found',
        type: ErrorResponse,
    })
    async getCocktail(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Cocktails> {
        console.log('info: getting cocktail by id', id);
        return this.cocktailsService.findOne(id);
    }
}
