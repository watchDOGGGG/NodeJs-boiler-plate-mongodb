import { Types, Document } from 'mongoose'

export const TokenContexts = ['auth', 'twoFA', 'refreshToken'] as const
export type TokenContext = (typeof TokenContexts)[number]

export const TokenBuckets = ['user', 'org_representative'] as const
export type TokenBucket = (typeof TokenBuckets)[number]

export interface Token {
  token: string
  context: TokenContext
  expires?: Date
  bucket: TokenBucket
  user_id: Types.ObjectId
}

export type TokenDocument = (Document<Types.ObjectId, unknown, Token> & Token & { _id: Types.ObjectId }) | null
