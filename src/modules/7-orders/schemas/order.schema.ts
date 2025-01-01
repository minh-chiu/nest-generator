import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~pre-built/1-users/schemas/user.schema";
import { OrderStatusEnum } from "../enums/order-status.enum";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "orders",
})
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  readonly userId: ObjectId;

  @Prop({
    type: {
      totalPrice: Number,
      totalApplyDiscount: Number,
      feeShip: Number,
    },
    default: {},
  })
  readonly checkout: {
    totalPrice: number;
    totalApplyDiscount: number;
    feeShip: number;
  };

  @Prop({
    type: { street: String, province: String, state: String, country: String },
    default: {},
  })
  shipping: {
    street: string;
    province: string;
    state: string;
    country: string;
  };

  @Prop({ type: Object, default: {} })
  readonly payment: any;

  @Prop({ type: Array, default: [] })
  products: any[];

  @Prop({ type: String, default: "#0000118052023" })
  trackingNumber: string;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.Pending,
  })
  status: OrderStatusEnum;
}

export type OrderDocument = Order & HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
