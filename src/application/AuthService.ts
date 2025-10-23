interface RegisterDTO {
    email: string;
    password: string;
    confirm_password: string;
}

export class AuthService {
    constructor() {
        
    }

    async register(data: RegisterDTO): Promise<void> {

    }
}