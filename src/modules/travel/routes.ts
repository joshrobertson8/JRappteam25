import { Router } from 'express';
import { createRecord, getRecord, updateRecord, listRecords, deleteRecord } from './controller';

const router = Router();

router.post('/', createRecord);

router.get('/', listRecords);

router.get('/:id', getRecord);

router.patch('/:id', updateRecord);

router.delete('/:id', deleteRecord);

export default router;
