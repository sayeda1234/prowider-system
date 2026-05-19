import mongoose from "mongoose";

const allocationStateSchema = new mongoose.Schema({
  service: String,
  currentIndex: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.AllocationState ||
  mongoose.model("AllocationState", allocationStateSchema);