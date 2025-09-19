import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@/config/upload';

import isAuthenticated from '@/shared/infra/http/middlewares/isAuthenticated';

import TransactionsController from '@/shared/infra/http/controllers/transactions/TransactionsController';
import ImportTransactionsController from '@/shared/infra/http/controllers/transactions/ImportTransactionsController';
import BalanceController from '@/shared/infra/http/controllers/transactions/BalanceController';
import GetTransactionsCountByCategoryController from '@/shared/infra/http/controllers/transactions/GetTransactionsCountByCategoryController';
import GetTransactionsValueByCategoryController from '@/shared/infra/http/controllers/transactions/GetTransactionsValueByCategoryController';
import GetTransactionsOverviewController from '@/shared/infra/http/controllers/transactions/GetTransactionsOverviewController';
import GetBalanceGraphController from '@/shared/infra/http/controllers/transactions/GetBalanceGraphController';

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
