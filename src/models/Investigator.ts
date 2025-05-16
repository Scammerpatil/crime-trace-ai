import mongoose, { Schema } from "mongoose";

const InvestigatorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9703/9703596.png",
  },
  contact: {
    type: String,
    required: true,
  },
  desigination: {
    type: String,
    required: true,
  },
});

const Investigator =
  mongoose.models.Investigator ||
  mongoose.model("Investigator", InvestigatorSchema);

export default Investigator;
