import { Request, Response } from 'express';
import { AuthenticateUseCase } from '../../application/use-cases/auth/Authenticate.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUser.use-case';
import { GetAllPartnersUseCase } from '../../application/use-cases/auth/GetAllPartners.use-case';
import { loginSchema, registerSchema } from '../../application/validators/auth.validator';

export class AuthController {
  constructor(
    private readonly authenticateUseCase: AuthenticateUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getAllPartnersUseCase: GetAllPartnersUseCase
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: validationResult.error.errors,
      });
      return;
    }

    const response = await this.authenticateUseCase.execute(
      validationResult.data
    );

    if (!response) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    res.json(response);
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: validationResult.error.errors,
      });
      return;
    }

    try {
      const user = await this.registerUserUseCase.execute(
        validationResult.data
      );

      res.json({
        message: `Usuário '${user.username}' registrado com sucesso.`,
        userId: user.id,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      if (errorMessage.includes('já existe')) {
        res.status(400).json({ message: errorMessage });
        return;
      }

      res.status(500).json({
        message: 'Ocorreu um erro ao registrar o usuário.',
      });
    }
  };

  getAllPartners = async (_req: Request, res: Response): Promise<void> => {
    try {
      const partners = await this.getAllPartnersUseCase.execute();
      
      if (!Array.isArray(partners)) {
        res.status(500).json({
          message: 'Erro interno: resposta inválida do servidor.',
        });
        return;
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.json(partners);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      res.status(500).json({
        message: 'Ocorreu um erro ao buscar os sócios.',
        error: errorMessage,
      });
    }
  };
}

