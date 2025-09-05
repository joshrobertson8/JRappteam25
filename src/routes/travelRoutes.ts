import { Router } from 'express';
import { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord } from '../controllers/travelController';

const router = Router();

router.post('/', createRecord);

router.get('/', getAllRecords);

router.get('/:id', getRecordById);

router.put('/:id', updateRecord);

router.delete('/:id', deleteRecord);

export default router;
