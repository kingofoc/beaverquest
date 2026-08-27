import { model, Schema, models, Document } from 'mongoose';

export interface IPendingCommunityVerification extends Document {
 ownerId: number;
 communityId: number;
 communityName: string;
 communityUsername?: string | null;
 createdAt: Date;
}

const schema = new Schema<IPendingCommunityVerification>({
 ownerId: { type: Number, required: true, unique: true },
 communityId: { type: Number, required: true },
 communityName: { type: String, required: true },
 communityUsername: { type: String, default: null },
}, { timestamps: true })

schema.index({ createdAt: 1 }, { expireAfterSeconds: 1000 });

export const PendingCommunityVerification = 
 models.PendingCommunityVerification || model<IPendingCommunityVerification>("PendingCommunityVerification", schema);