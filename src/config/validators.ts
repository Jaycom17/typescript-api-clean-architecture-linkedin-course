export class Validators{
    static get email():RegExp {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    }

    static get password():RegExp {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    }
}