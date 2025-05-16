import mongoose, { Schema } from "mongoose";

const CaseSchema = new Schema(
  {
    caseId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },

    investigator: {
      type: Schema.Types.ObjectId,
      ref: "Investigator",
      required: true,
    },

    typeOfCrime: { type: String, required: true },
    dateOfCrime: { type: Date, required: true },

    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },

    evidence: [
      {
        type: {
          type: String,
          enum: ["image", "video", "document"],
          required: true,
        },
        url: { type: String, required: true },
        uploadedBy: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    witnesses: [
      {
        name: { type: String, required: true },
        statement: { type: String, required: true },
      },
    ],

    suspect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suspect",
    },

    tags: [{ type: String }],

    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Case = mongoose.models.Case || mongoose.model("Case", CaseSchema);
export default Case;
