import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Product } from "~modules/1-products/schemas/product.schema";
import { Shop } from "~modules/1-shops/schemas/shop.schema";
import { Cart } from "~modules/3-carts/schemas/cart.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "inventories",
})
export class Inventory {
  @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name })
  shopId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ type: String, default: "unknown" })
  location: string;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({
    type: [
      {
        quantity: Number,
        cartId: { type: SchemaTypes.ObjectId, ref: Cart.name },
        createdAt: Date,
      },
    ],
    default: [],
  })
  reservations: {
    quantity: number;
    cartId: Types.ObjectId;
    createdAt: Date;
  }[];
}

export type InventoryDocument = Inventory & HydratedDocument<Inventory>;
export const InventorySchema = SchemaFactory.createForClass(Inventory);
