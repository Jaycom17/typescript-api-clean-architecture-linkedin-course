import { JwtAdapter } from "../../config";
import { LoginDTO } from "../dtos/auth/login-user.dto";
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

interface LoginUseCase {
    execute(loginDTO: LoginDTO):Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUseCaseImpl implements LoginUseCase {

    constructor(private readonly authRepository: AuthRepository, private readonly signToken: SignToken = JwtAdapter.generateToken) {}

    async execute(loginDTO: LoginDTO): Promise<UserToken> {

        const user = await this.authRepository.login(loginDTO);

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