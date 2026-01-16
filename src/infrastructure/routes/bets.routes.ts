import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { BetsController } from '../controllers/BetsController';
import { BetRepository } from '../repositories/BetRepository';
import { PartnerSiglaRepository } from '../repositories/PartnerSiglaRepository';
import { CreateBetUseCase } from '../../application/use-cases/bets/CreateBet.use-case';
import { GetBetsByPartnerIdUseCase } from '../../application/use-cases/bets/GetBetsByPartnerId.use-case';
import { UpdateBetPaidStatusUseCase } from '../../application/use-cases/bets/UpdateBetPaidStatus.use-case';
import { DeleteBetUseCase } from '../../application/use-cases/bets/DeleteBet.use-case';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router: ExpressRouter = Router();

const betRepository = new BetRepository();
const partnerSiglaRepository = new PartnerSiglaRepository();

const createBetUseCase = new CreateBetUseCase(betRepository);
const getBetsByPartnerIdUseCase = new GetBetsByPartnerIdUseCase(betRepository);
const updateBetPaidStatusUseCase = new UpdateBetPaidStatusUseCase(betRepository);
const deleteBetUseCase = new DeleteBetUseCase(betRepository);

const betsController = new BetsController(
  createBetUseCase,
  getBetsByPartnerIdUseCase,
  updateBetPaidStatusUseCase,
  deleteBetUseCase,
  partnerSiglaRepository,
  betRepository
);

router.post('/', betsController.createBet);
router.get('/public/:partnerId', betsController.getPublicPartnerBets);
router.get(
  '/partner',
  authenticate,
  authorize('Partner', 'Admin'),
  betsController.getPartnerBets
);
router.post(
  '/partner/export',
  authenticate,
  authorize('Partner', 'Admin'),
  betsController.exportPartnerBets
);
router.put(
  '/:id/paid',
  authenticate,
  authorize('Partner', 'Admin'),
  betsController.updateBetPaidStatus
);
router.delete(
  '/:id',
  authenticate,
  authorize('Partner', 'Admin'),
  betsController.deleteBet
);

export { router as betsRouter };

