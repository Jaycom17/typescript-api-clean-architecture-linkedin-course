import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    port: get('PORT').required().asPortNumber(),
    mongoUrl: get('MONGO_URL').required().asString(),
    dbName: get('MONGO_DB_NAME').required().asString(),
    jwtSecret: get('JWT_SEED').required().asString(),
};