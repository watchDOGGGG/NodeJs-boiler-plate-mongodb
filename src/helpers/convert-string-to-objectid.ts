import { Types } from 'mongoose'

export const convertStringToObjectId = (str: string) => {
  return new Types.ObjectId(str)
}
