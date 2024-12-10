import { Validators } from "../../../config";

export class LoginDTO{
    private constructor(
        public email: string,
        public password: string
    ){}

    static create(object: { [key: string]: any }): [string?, LoginDTO?] {
        const { email, password } = object;

        if (!email) return ["Email is required"];

        if (!Validators.email.test(email)) return ["Invalid email"];

        if (!password) return ["Password is required"];

        return [undefined, new LoginDTO(email, password)];
    }
}