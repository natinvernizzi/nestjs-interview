import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTodoListDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is mandatory' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  name: string;
}
