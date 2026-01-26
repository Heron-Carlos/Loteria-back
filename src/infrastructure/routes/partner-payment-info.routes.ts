import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { PartnerPaymentInfoController } from '../controllers/PartnerPaymentInfoController';
import { PartnerPaymentInfoRepository } from '../repositories/PartnerPaymentInfoRepository';
import { GetPartnerPaymentInfoUseCase } from '../../application/use-cases/partner/GetPartnerPaymentInfo.use-case';
import { CreatePartnerPaymentInfoUseCase } from '../../application/use-cases/partner/CreatePartnerPaymentInfo.use-case';
import { UpdatePartnerPaymentInfoUseCase } from '../../application/use-cases/partner/UpdatePartnerPaymentInfo.use-case';
import { DeletePartnerPaymentInfoUseCase } from '../../application/use-cases/partner/DeletePartnerPaymentInfo.use-case';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router: ExpressRouter = Router();

const partnerPaymentInfoRepository = new PartnerPaymentInfoRepository();
const getPartnerPaymentInfoUseCase = new GetPartnerPaymentInfoUseCase(partnerPaymentInfoRepository);
const createPartnerPaymentInfoUseCase = new CreatePartnerPaymentInfoUseCase(partnerPaymentInfoRepository);
const updatePartnerPaymentInfoUseCase = new UpdatePartnerPaymentInfoUseCase(partnerPaymentInfoRepository);
const deletePartnerPaymentInfoUseCase = new DeletePartnerPaymentInfoUseCase(partnerPaymentInfoRepository);

const partnerPaymentInfoController = new PartnerPaymentInfoController(
  getPartnerPaymentInfoUseCase,
  createPartnerPaymentInfoUseCase,
  updatePartnerPaymentInfoUseCase,
  deletePartnerPaymentInfoUseCase
);

router.get('/:partnerId', partnerPaymentInfoController.getByPartnerId);
router.post(
  '/',
  authenticate,
  authorize('Admin'),
  partnerPaymentInfoController.create
);
router.put(
  '/:id',
  authenticate,
  authorize('Admin'),
  partnerPaymentInfoController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  partnerPaymentInfoController.delete
);

export { router as partnerPaymentInfoRouter };

