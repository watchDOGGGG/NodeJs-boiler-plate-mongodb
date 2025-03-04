/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express'

type AsyncFunction = (req: any, res: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (execution: AsyncFunction) => (req: any, res: Response, next: NextFunction) => {
  execution(req, res, next).catch(next)
}
