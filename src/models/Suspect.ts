import mongoose, { Schema } from "mongoose";

const SuspectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  criminalRecord: [
    {
      crimeType: { type: String, required: true }, // e.g., "Robbery"
      location: { type: String, required: true }, // e.g., "Delhi"
      date: { type: Date, required: true },
    },
  ],
  lastKnownLocation: {
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    address: { type: String, required: true },
  },
  knownAffiliations: [String],
  faceEmbedding: {
    type: [Number],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
});

const Suspect =
  mongoose.models.Suspect || mongoose.model("Suspect", SuspectSchema);

export default Suspect;
