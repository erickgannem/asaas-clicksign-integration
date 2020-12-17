import { Request, Response, NextFunction } from 'express'

interface HttpError {
  message: string,
  status: number
}

const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => res.status(500).json({ error: err.message })

export default errorMiddleware
