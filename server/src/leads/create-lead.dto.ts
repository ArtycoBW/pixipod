import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;

export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @Transform(trim)
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  contact: string;

  @Transform(trim)
  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  project: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
