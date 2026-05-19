import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: String,
  monthlyQuota: {
    type: Number,
    default: 10,
  },
  usedQuota: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Provider ||
  mongoose.model("Provider", providerSchema);