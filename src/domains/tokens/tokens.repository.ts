import { Schema, Model, model } from 'mongoose'
import { Token, TokenContexts, TokenBuckets } from './tokens.interface'

const tokensSchema = new Schema<Token, Model<Token>, Token>(
  {
    token: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
      enum: TokenContexts,
    },
    expires: {
      type: Date,
      required: false,
    },
    bucket: {
      type: String,
      required: true,
      enum: TokenBuckets,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

export const TokensRepository = model<Token, Model<Token>>('Token', tokensSchema)
