import { model, Schema, models, Document } from 'mongoose';

export interface IPendingCommunityVerification extends Document {
 ownerId: number;
 channelId: number;
 channelTitle: string;
 channelUsername?: string | null;
 createdAt: Date;
}

const schema = new Schema<IPendingCommunityVerification>({
 ownerId: { type: Number, required: true, unique: true },
 channelId: { type: Number, required: true },
 channelTitle: { type: String, required: true },
 channelUsername: { type: String, default: null },
}, { timestamps: true })

schema.index({ createdAt: 1 }, { expireAfterSeconds: 1000 });

export const PendingCommunityVerification = 
 models.PendingCommunityVerification || model<IPendingCommunityVerification>("PendingCommunityVerification", schema);