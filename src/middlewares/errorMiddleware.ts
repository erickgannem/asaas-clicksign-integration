import { Request, Response, NextFunction } from 'express'

interface HttpError {
  message: string,
  status: number
}

const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  return process.stdout.write(`\n>> [Error Handler] ${err.message} \n`)
}

export default errorMiddleware
