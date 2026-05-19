import mongoose from "mongoose";

const webhookEventSchema =
  new mongoose.Schema(
    {
      eventId: {
        type: String,
        required: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.WebhookEvent ||
  mongoose.model(
    "WebhookEvent",
    webhookEventSchema
  );