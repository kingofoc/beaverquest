import { model, Schema, models, Document } from 'mongoose';

export interface IGigs extends Document {
 publisherId: number;
 category: string;
 subCategory: string;
 title: string;
 description: string;
 guidelines: string;
 reward: number;
 country: string[];
 url: string;
 iconUrl: string;
 max: number;
 progress: number;
 status: "pending" | "active" | "paused" | "ended" | "rejected";
 rejectionReason: string;
 verificationType:
  | "telegram"
  | "manual";

 verificationConfig?: {
  action?: string;
  target?: string;
  provider?: string;
 };

 createdAt: Date;
 updatedAt: Date;
}

const gigsSchema = new Schema<IGigs>({
 publisherId: {
  type: Number,
  required: true
 },

 category: {
  type: String,
  required: true
 },

 subCategory: {
  type: String,
  required: true
 },

 title: {
  type: String,
  required: true
 },

 description: {
  type: String,
  required: true
 },

 guidelines: {
  type: String,
  required: true
 },

 reward: {
  type: Number,
  required: true
 },

 country: {
  type: [String],
 },

 url: {
  type: String,
 },

 iconUrl: {
  type: String
 },

 max: {
  type: Number,
  required: true
 },

 progress: {
  type: Number,
  default: 0
 },

 status: {
  type: String,
  enum: ["pending", "active", "paused", "ended", "rejected"],
  default: "pending"
 },

 rejectionReason: {
  type: String
 },

 verificationType: {
  type: String,
  enum: [
   "telegram",
   "manual",
  ],
  default: "manual"
 },

 verificationConfig: {
  action: String,
  target: String,
  provider: String
 }
},

{
 timestamps: true
});

gigsSchema.index({ status: 1, category: 1 });
gigsSchema.index({ publisherId: 1 });

export const Gigs = models.Gigs || model<IGigs>("Gigs", gigsSchema);