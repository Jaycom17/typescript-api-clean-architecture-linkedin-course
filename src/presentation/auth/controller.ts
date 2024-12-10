import { Request, Response } from "express";
import {
  AuthRepository,
  CustumError,
  RegisterUserDto,
  LoginDTO,
  RegisterUserUseCaseImpl,
  LoginUseCaseImpl,
} from "../../domain";
import { UserModel } from "../../data/mongodb";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustumError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new RegisterUserUseCaseImpl(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginDTO.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new LoginUseCaseImpl(this.authRepository)
      .execute(loginDto!)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) => {
        res.json({ users, user: req.body.user });
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
