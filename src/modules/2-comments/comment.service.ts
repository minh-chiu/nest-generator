import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Comment, CommentDocument } from "./schemas/comment.schema";

@Injectable()
export class CommentService extends BaseService<CommentDocument> {
  constructor(@InjectModel(Comment.name) model: Model<CommentDocument>) {
    super(model);
  }
}
