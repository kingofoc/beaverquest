import { model, Schema, models, Document } from 'mongoose';

export interface ICommunity extends Document {
 ownerId: number;
 communityId: number;
 communityName: string;
 communityUsername: string;
 communityType: string;
 name: string;
 description?: string;
 iconUrl?: string;
 memberCount: number;
 balance: number;
 commissionRate: number;
 botVerified: boolean;
 botVerifiedAt?: Date;
 status: "pending_verification" | "active" | "rejected" | "suspended";
 rejectionReason?: string;
 createdAt: Date;
 updatedAt: Date;
}

const communitySchema = new Schema<ICommunity> ({
 ownerId: {
 type: Number,
 required: true
},

 communityId: {
  type: Number,
  required: true,
  unique: true
 },

 communityName: {
  type: String,
  required: true
 },

 communityUsername: {
  type: String,
  required: true,
  unique: true
 },

 communityType: {
  type: String,
  required: true
 },

 name: {
  type: String,
  required: true
 },

 description: {
  type: String
 },

 iconUrl: {
  type: String
 },

 memberCount: {
  type: Number,
  default: 0
 },

 balance: {
  type: Number,
  default: 0
 },

 commissionRate: {
  type: Number,
  default: 0.1 // 10% of each completed gig reward from this community's members
 },

 botVerified: {
  type: Boolean,
  default: false
 },

 botVerifiedAt: {
  type: Date
 },

 status: {
  type: String,
  enum: ["pending_verification", "active", "rejected", "suspended"],
  default: "pending_verification"
 },

 rejectionReason: {
  type: String
 }
},

{
 timestamps: true
})

communitySchema.index({ ownerId: 1 });
communitySchema.index({ status: 1 });

export const Community = models.Community || model<ICommunity>("Community", communitySchema);