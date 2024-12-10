import { JwtAdapter } from "../../config";
import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { CustumError } from "../errors/custum.error";
import { AuthRepository } from "../repositories/auth.repository";

interface UserToken {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    }
}

interface RegisterUserUseCase {
    execute(registerUserDto: RegisterUserDto):Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class RegisterUserUseCaseImpl implements RegisterUserUseCase {

    constructor(private readonly authRepository: AuthRepository, private readonly signToken: SignToken = JwtAdapter.generateToken) {}

    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {

        const user = await this.authRepository.register(registerUserDto);

        const token = await this.signToken({ id: user.id }, "2h");

        if (!token) {
            throw CustumError.internal();
        }


        return {
            token: token,
            user:{
                id: user.id,
                email: user.email,
                name: user.name,
            }
        };
    }
}