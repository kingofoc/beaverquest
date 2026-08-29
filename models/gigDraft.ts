// models/gigDraft.ts
import { model, Schema, models, Document } from 'mongoose';

export interface IGigDraft extends Document {
  publisherId: number;
  formData: Record<string, []>;
  step: number;
  updatedAt: Date;
}

const gigDraftSchema = new Schema<IGigDraft>({
  publisherId: {
    type: Number,
    required: true,
    unique: true
  },
  formData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  step: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

gigDraftSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 1800 });

export const GigDraft = models.GigDraft || model<IGigDraft>("GigDraft", gigDraftSchema);