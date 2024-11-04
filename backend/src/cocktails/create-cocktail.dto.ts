import { PickType } from '@nestjs/swagger';
import { Cocktails } from './cocktails.entity';

/**
 * DTO for creating a new cocktail.
 * This will only include the necessary fields: title, description, and price.
 */
export class CreateCocktail extends PickType(Cocktails, [
    'title',
    'description',
    'price',
] as const) {}
