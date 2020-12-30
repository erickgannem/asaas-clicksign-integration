import { Request, Response, NextFunction } from 'express'

interface HttpError {
  message: string,
  status: number
}

const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  process.stdout.write(`\n>> [Error Handler] ${err.message} \n`)

  return res.status(500).json({
    errorMessage: err.message
  })
}

export default errorMiddleware
