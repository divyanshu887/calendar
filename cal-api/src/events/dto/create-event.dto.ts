import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;
}
