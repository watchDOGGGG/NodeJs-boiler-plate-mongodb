import { Types } from 'mongoose'

export type FilterParams<T> = {
  [P in keyof T]?: T[P] | undefined
} & {
  _id?: Types.ObjectId | undefined
  $or?: Array<{ [key in keyof T]?: T[key] | RegExp }>
}
