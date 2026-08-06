import { model, Schema, models, Document } from 'mongoose';

export interface IProofItem {
  type: "text" | "image" | "video";
  value: string;
}

export interface IProof extends Document {
  gigsId: Schema.Types.ObjectId;
  publisherId: number;
  userId: number;
  firstName: string;
  proof: IProofItem[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedAt?: Date;
  reviewedBy?: number | "bot";
  createdAt: Date;
  updatedAt: Date;
}

const proofSchema = new Schema<IProof>({
  gigsId: {
    type: Schema.Types.ObjectId,
    ref: "Gigs",
    required: true
  },

  publisherId: {
    type: Number,
    required: true
  },

  userId: {
    type: Number,
    required: true
  },

  firstName: {
    type: String,
  },

  proof: [{
    type: {
      type: String,
      enum: ["text", "image", "video"]
    },
    value: String
  }],

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  rejectionReason: {
    type: String
  },

  reviewedAt: Date,

  reviewedBy: {
    type: Schema.Types.Mixed
  }
},

{
  timestamps: true
});

proofSchema.index({ gigsId: 1, status: 1 });
proofSchema.index({ userId: 1 });

export const Proof = models.Proof || model<IProof>("Proof", proofSchema);