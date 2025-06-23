import morgan from 'morgan'
import type { Request, Response, NextFunction } from 'express'

const logger = () => {
  if (process.env.NODE_ENV === 'development') {
    return morgan('dev', {
      skip: (req: Request) =>
        req.url.startsWith('/assets/') ||
        req.url.startsWith('/css/') ||
        req.url.startsWith('/js/')
    })
  }
  return (req: Request, res: Response, next: NextFunction) => next()
}

export default logger