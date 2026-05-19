import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index(
  { leadId: 1, providerId: 1 },
  { unique: true }
);
export default mongoose.models.LeadAssignment ||
  mongoose.model("LeadAssignment", assignmentSchema);