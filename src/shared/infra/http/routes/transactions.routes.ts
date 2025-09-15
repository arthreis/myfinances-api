import { Router } from 'express';

import multer from 'multer';
import uploadConfig from 'config/upload.js';

import isAuthenticated from '@http/middlewares/isAuthenticated.js';

import TransactionsController from '@controllers/transactions/TransactionsController.js';
import ImportTransactionsController from '@controllers/transactions/ImportTransactionsController.js';
import BalanceController from '@controllers/transactions/BalanceController.js';
import GetTransactionsCountByCategoryController from '@controllers/transactions/GetTransactionsCountByCategoryController.js';
import GetTransactionsValueByCategoryController from '@controllers/transactions/GetTransactionsValueByCategoryController.js';
import GetTransactionsOverviewController from '@controllers/transactions/GetTransactionsOverviewController.js';
import GetBalanceGraphController from '@controllers/transactions/GetBalanceGraphController.js';

const upload = multer(uploadConfig);

const transactionsRouter = Router();
const transactionsController = new TransactionsController();
const balanceController = new BalanceController();
const getBalanceGraphController = new GetBalanceGraphController();
const getTransactionsCountByCategoryController = new GetTransactionsCountByCategoryController();
const getTransactionsOverviewController = new GetTransactionsOverviewController();
const importTranscationsController = new ImportTransactionsController();
const getTransactionsValueByCategoryController = new GetTransactionsValueByCategoryController();

transactionsRouter.use(isAuthenticated);

transactionsRouter.get('/', transactionsController.index);
transactionsRouter.post('/', transactionsController.store);
transactionsRouter.put('/:id', transactionsController.update);
transactionsRouter.delete('/:id', transactionsController.delete);
transactionsRouter.post('/import', upload.single('file'), importTranscationsController.store,);
transactionsRouter.get('/balance', balanceController.index);
transactionsRouter.get('/count-by-category', getTransactionsCountByCategoryController.index,);
transactionsRouter.get('/value-by-category', getTransactionsValueByCategoryController.index,);
transactionsRouter.get('/overview-data', getTransactionsOverviewController.index,);
transactionsRouter.get('/balance-graph', getBalanceGraphController.index);

export default transactionsRouter;
