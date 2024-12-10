import jwt from 'jsonwebtoken';
import { envs } from './envs';

const jwtSecret = envs.jwtSecret;

export class JwtAdapter{
    static async generateToken(payload: Object, duration: string = "2h"): Promise<string|null> {
        return new Promise((resolve) => {
            jwt.sign(payload, jwtSecret, { expiresIn: duration }, (err, token) => {
                if (err) {
                    return resolve(null);
                } 

                return resolve(token!);
            });
        });
    }

    static async validateToken<T>(token: string): Promise<T|null> {
        return new Promise((resolve) => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    return resolve(null);
                }

                return resolve(decoded as T);
            });
        });
    }
}