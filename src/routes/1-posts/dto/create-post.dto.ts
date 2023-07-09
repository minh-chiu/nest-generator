import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

export class CreatePostDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly postedBy: string;

	@IsOptional()
	@IsString()
	readonly text: string;

	@IsOptional()
	@IsString()
	readonly image: string;

	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	readonly likes: string[];
}
