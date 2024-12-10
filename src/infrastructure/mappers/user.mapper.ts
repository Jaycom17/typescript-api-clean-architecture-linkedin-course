import { CustumError, UserEntity } from "../../domain";

export class UserMapper {
    static userEntityFromObject(obj: {[key: string]: any}) {
        const { id, _id, name, email, password, roles } = obj;

        if (!id && !_id) {
            throw CustumError.badRequest("User id not found");
        }

        if (!name) {
            throw CustumError.badRequest("User name not found");
        }

        if (!email) {
            throw CustumError.badRequest("User email not found");
        }

        if (!password) {
            throw CustumError.badRequest("User password not found");
        }

        if (!roles) {
            throw CustumError.badRequest("User roles not found");
        }

        return new UserEntity(id || _id, name, email, password, roles);
    }
}