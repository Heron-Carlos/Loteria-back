import { Request, Response } from 'express';
import { CreateBetUseCase } from '../../application/use-cases/bets/CreateBet.use-case';
import { GetBetsByPartnerIdUseCase } from '../../application/use-cases/bets/GetBetsByPartnerId.use-case';
import { UpdateBetPaidStatusUseCase } from '../../application/use-cases/bets/UpdateBetPaidStatus.use-case';
import { DeleteBetUseCase } from '../../application/use-cases/bets/DeleteBet.use-case';
import { createBetSchema } from '../../application/validators/bet.validator';
import { generateExcel } from '../../application/services/excel-export.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class BetsController {
  constructor(
    private readonly createBetUseCase: CreateBetUseCase,
    private readonly getBetsByPartnerIdUseCase: GetBetsByPartnerIdUseCase,
    private readonly updateBetPaidStatusUseCase: UpdateBetPaidStatusUseCase,
    private readonly deleteBetUseCase: DeleteBetUseCase
  ) {}

  createBet = async (req: Request, res: Response): Promise<void> => {
    const validationResult = createBetSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: validationResult.error.errors,
      });
      return;
    }

    const betId = await this.createBetUseCase.execute(validationResult.data);

    res.status(201).json({ id: betId });
  };

  getPartnerBets = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado.' });
      return;
    }

    const partnerId = req.user.partnerId;

    if (!partnerId) {
      res.status(403).json({ message: 'Sócio não identificado.' });
      return;
    }

    const gameType = req.query.gameType as string | undefined;

    const bets = await this.getBetsByPartnerIdUseCase.execute({
      partnerId,
      gameType,
    });

    res.json(bets);
  };

  exportPartnerBets = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado.' });
      return;
    }

    const partnerId = req.user.partnerId;

    if (!partnerId) {
      res.status(403).json({ message: 'Sócio não identificado.' });
      return;
    }

    const megaSigla = req.user.megaSigla || '';
    const quinaSigla = req.user.quinaSigla || '';

    if (!megaSigla || !quinaSigla) {
      res.status(400).json({
        message: 'Siglas do sócio não encontradas no token.',
      });
      return;
    }

    const gameType = req.query.gameType as string | undefined;

    const bets = await this.getBetsByPartnerIdUseCase.execute({
      partnerId,
      gameType,
    });

    if (bets.length === 0) {
      const gameTypeLabel = gameType || 'todos os tipos';
      res.status(404).json({
        message: `Nenhuma aposta de ${gameTypeLabel} encontrada para exportar.`,
      });
      return;
    }

    const buffer = await generateExcel(bets, megaSigla, quinaSigla);

    const gameTypeLabel = gameType || 'todas';
    const filename = `apostas_${gameTypeLabel}_${req.user.username || 'socio'}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  };

  updateBetPaidStatus = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado.' });
      return;
    }

    const partnerId = req.user.partnerId;

    if (!partnerId) {
      res.status(403).json({ message: 'Sócio não identificado.' });
      return;
    }

    const betId = req.params.id;
    const isPaid = req.query.isPaid === 'true';

    try {
      await this.updateBetPaidStatusUseCase.execute({
        betId,
        isPaid,
        requesterPartnerId: partnerId,
      });

      res.json({ message: 'Status de pagamento atualizado com sucesso.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      if (errorMessage.includes('não encontrada')) {
        res.status(404).json({ message: errorMessage });
        return;
      }

      if (errorMessage.includes('permissão')) {
        res.status(403).json({ message: errorMessage });
        return;
      }

      res.status(500).json({
        message: 'Ocorreu um erro ao atualizar o status de pagamento.',
      });
    }
  };

  deleteBet = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado.' });
      return;
    }

    const partnerId = req.user.partnerId;

    if (!partnerId) {
      res.status(403).json({ message: 'Sócio não identificado.' });
      return;
    }

    const betId = req.params.id;

    try {
      await this.deleteBetUseCase.execute({
        betId,
        requesterPartnerId: partnerId,
      });

      res.json({ message: 'Aposta excluída com sucesso.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      if (errorMessage.includes('não encontrada')) {
        res.status(404).json({ message: errorMessage });
        return;
      }

      if (errorMessage.includes('permissão')) {
        res.status(403).json({ message: errorMessage });
        return;
      }

      res.status(500).json({
        message: 'Ocorreu um erro ao excluir a aposta.',
      });
    }
  };
}

