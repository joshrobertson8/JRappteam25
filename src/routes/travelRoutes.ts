import { Router } from 'express';
import { createRecord, getRecords } from '../controllers/travelController';

const router = Router();

router.post('/', createRecord);
router.get('/', getRecords);

export default router;
