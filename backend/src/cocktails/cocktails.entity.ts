import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['title'], { unique: true })
export class Cocktails {
    @ApiProperty({
        description: 'Unique identifier for the cocktail',
        default: 1,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'The title of the cocktail',
        default: 'Mojito Classic',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Column()
    title: string;

    @ApiProperty({
        description: 'Detailed description of the cocktail',
        default: 'Mojito Classic is lekker',
    })
    @IsString()
    @Column()
    description: string;

    @ApiProperty({
        description: 'Price of the cocktail',
        default: 10,
    })
    @IsPositive()
    @IsNotEmpty()
    @Column('decimal')
    price: number;
}
