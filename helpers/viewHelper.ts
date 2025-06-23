import path from 'path';
import type { Response } from 'express';

export function sendView(res: Response, file: string) {
  res.sendFile(file, { root: path.join(process.cwd(), 'views') });
}