import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticateUseCase } from '../../application/use-cases/auth/Authenticate.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUser.use-case';
import { GetAllPartnersUseCase } from '../../application/use-cases/auth/GetAllPartners.use-case';

const router: ExpressRouter = Router();

const userRepository = new UserRepository();
const authenticateUseCase = new AuthenticateUseCase(userRepository);
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const getAllPartnersUseCase = new GetAllPartnersUseCase(userRepository);

const authController = new AuthController(
  authenticateUseCase,
  registerUserUseCase,
  getAllPartnersUseCase
);

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/partners', authController.getAllPartners);

export { router as authRouter };

