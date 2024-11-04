import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function handleDatabaseError(error: unknown): void {
    console.error('Database error:', error);
    if (isUniqueConstraintViolation(error)) {
        throw new ConflictException('Cocktail already exists');
    }

    throw new InternalServerErrorException(
        'An unexpected error occurred while processing your request',
    );
}

function isUniqueConstraintViolation(
    error: unknown,
): error is QueryFailedError {
    return (
        error instanceof QueryFailedError && error.driverError?.code === '23505'
    );
}
