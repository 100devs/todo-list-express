import express from 'express';
const router = express.Router();
import type { Request, Response } from 'express';
import { sendView } from '../helpers/viewHelper';

router.get('/', (req: Request, res: Response) => sendView(res, 'index.html'));

export default router