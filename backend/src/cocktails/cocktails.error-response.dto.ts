import { ApiProperty } from '@nestjs/swagger';
import type { HttpStatus } from '@nestjs/common';

export class ErrorResponse {
    @ApiProperty({
        description: 'Error message returned when a cocktail is not found',
        default: { message: 'Cocktail not found', status: 404 },
    })
    message: Record<string, unknown> | string;

    statusCode: HttpStatus;

    error: string;
}
