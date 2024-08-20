import { Schema, model, models } from "mongoose";

const UserTokenImagesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  labels: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserTokenImage = models?.UserTokenImage || model("UserTokenImage", UserTokenImagesSchema);

export default UserTokenImage;