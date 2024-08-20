import { Document, Schema, model, models } from "mongoose";

export interface IImage extends Document {
  title: string;
  blobUrl: string;
  withBackgroundUrl: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  }
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  blobUrl: { type: String, required: true },
  withBackgroundUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Image = models?.Image || model('Image', ImageSchema);

export default Image;