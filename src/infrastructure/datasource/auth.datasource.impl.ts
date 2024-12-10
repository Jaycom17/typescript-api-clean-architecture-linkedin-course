import { UserModel } from "../../data/mongodb";
import {
  AuthDatasource,
  RegisterUserDto,
  UserEntity,
  CustumError,
} from "../../domain";
import { BcryptAdapter } from "../../config";
import { UserMapper } from "../mappers/user.mapper";
import { LoginDTO } from "../../domain/dtos/auth/login-user.dto";

type HashPassword = (password: string) => string;
type ComparePassword = (password: string, hashedPassword: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

  constructor(
    private readonly hashPassword: HashPassword = BcryptAdapter.hash,
    private readonly comparePassword: ComparePassword = BcryptAdapter.compare
  ) {}

  async register(resgisterUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = resgisterUserDto;

    try {
      const exists = await UserModel.findOne({ email: email });

      if (exists) {
        throw CustumError.badRequest("Email already exists");
      }

      const user = await UserModel.create({ name, email, password: this.hashPassword(password) });

      await user.save();  

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustumError) {
        throw error;
      }

      throw CustumError.internal();
    }
  }

  async login(loginDto: LoginDTO): Promise<UserEntity> {
    const { email, password } = loginDto;
    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        throw CustumError.badRequest("email or password is incorrect");
      }

      const isPasswordValid = this.comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw CustumError.badRequest("email or password is incorrect");
      }

      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      if (error instanceof CustumError) {
        throw error;
      }

      throw CustumError.internal();
    }
  }
}
