import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Shop, ShopDocument } from "./schemas/shop.schema";

@Injectable()
export class ShopService extends BaseService<ShopDocument> {
  constructor(@InjectModel(Shop.name) model: Model<ShopDocument>) {
    super(model);
  }
}
