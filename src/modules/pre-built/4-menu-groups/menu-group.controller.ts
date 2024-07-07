import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateMenuGroupDto } from "./dto/create-menu-group.dto";
import { UpdateMenuGroupDto } from "./dto/update-menu-group.dto";
import { MenuGroupService } from "./menu-group.service";

@Controller("menu_groups")
export class MenuGroupController {
	constructor(private readonly menuGroupService: MenuGroupService) {}

	//  ----- Method: GET -----
	@Get("/:id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.menuGroupService.findById(id, { projection, populate });
	}

	@Get("/")
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.menuGroupService.findMany(filter, options);
	}

	//  ----- Method: POST -----
	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async create(
		@GetCurrentUserId() userId: Types.ObjectId,
		@Body() body: CreateMenuGroupDto,
	) {
		Object.assign(body, { createdBy: userId });

		return this.menuGroupService.create(body);
	}

	//  ----- Method: PATCH -----
	@Patch("/:id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateMenuGroupDto,
	) {
		return this.menuGroupService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@Delete("/:ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.menuGroupService.deleteMany({
			_id: { $in: ids.split(",").map((id) => stringIdToObjectId(id)) },
		});
	}

	@Delete("/:id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.menuGroupService.deleteById(id);
	}
}
