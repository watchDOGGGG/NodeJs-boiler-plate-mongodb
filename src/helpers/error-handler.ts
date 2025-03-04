/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, _: Request, res: Response, next: NextFunction) => {
  let finalMessage = error.message
  let duplicateError = undefined
  let validationError = undefined

  if (error.code === 11000) {
    finalMessage = `${Object.keys(error.keyValue)} already exists`
    duplicateError = [
      {
        msg: `${Object.keys(error.keyValue)} already exists`,
        field: Object.keys(error.keyValue)[0],
      },
    ]
  }

  if (error.name === 'ValidationError') {
    finalMessage = 'Validation Error'
    validationError = []
    error.status = 422
    for (const field in error.errors) {
      if (Object.prototype.hasOwnProperty.call(error.errors, field)) {
        validationError.push({
          msg: error.errors[field].message,
          field: error.errors[field].path,
        })
      }
    }
  }

  res.status(error.status || 500).json({
    message: finalMessage,
    data: undefined,
    success: false,
    errors: duplicateError || validationError || error?.errors || {},
  })
  next()
}
