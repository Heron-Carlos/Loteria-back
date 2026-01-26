import { Request, Response } from 'express';
import { GetPartnerPaymentInfoUseCase } from '../../application/use-cases/partner/GetPartnerPaymentInfo.use-case';
import { CreatePartnerPaymentInfoUseCase } from '../../application/use-cases/partner/CreatePartnerPaymentInfo.use-case';
import { UpdatePartnerPaymentInfoUseCase } from '../../application/use-cases/partner/UpdatePartnerPaymentInfo.use-case';
import { DeletePartnerPaymentInfoUseCase } from '../../application/use-cases/partner/DeletePartnerPaymentInfo.use-case';
import {
  createPartnerPaymentInfoSchema,
  updatePartnerPaymentInfoSchema,
} from '../../application/validators/partner-payment-info.validator';

export class PartnerPaymentInfoController {
  constructor(
    private readonly getPartnerPaymentInfoUseCase: GetPartnerPaymentInfoUseCase,
    private readonly createPartnerPaymentInfoUseCase: CreatePartnerPaymentInfoUseCase,
    private readonly updatePartnerPaymentInfoUseCase: UpdatePartnerPaymentInfoUseCase,
    private readonly deletePartnerPaymentInfoUseCase: DeletePartnerPaymentInfoUseCase
  ) {}

  getByPartnerId = async (req: Request, res: Response): Promise<void> => {
    const { partnerId } = req.params;

    if (!partnerId) {
      res.status(400).json({ message: 'Partner ID é obrigatório.' });
      return;
    }

    const paymentInfo = await this.getPartnerPaymentInfoUseCase.execute(partnerId);
    res.json(paymentInfo);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const validationResult = createPartnerPaymentInfoSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: validationResult.error.errors,
      });
      return;
    }

    const paymentInfo = await this.createPartnerPaymentInfoUseCase.execute(validationResult.data);
    res.status(201).json(paymentInfo);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const validationResult = updatePartnerPaymentInfoSchema.safeParse({
      ...req.body,
      id: req.params.id,
    });

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: validationResult.error.errors,
      });
      return;
    }

    await this.updatePartnerPaymentInfoUseCase.execute(validationResult.data);
    res.json({ message: 'Informação de pagamento atualizada com sucesso.' });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'ID é obrigatório.' });
      return;
    }

    await this.deletePartnerPaymentInfoUseCase.execute(id);
    res.json({ message: 'Informação de pagamento excluída com sucesso.' });
  };
}

