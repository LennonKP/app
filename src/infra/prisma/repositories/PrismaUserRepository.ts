import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import prisma from "../PrismaClient";

export default class PrismaUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null

        const { id, name, password } = user
        return new User({ id, name, email, password })
    }

    async save(user: User): Promise<void> {
        const { id } = await prisma.user.create({
            data: {
                name: user.getName(),
                email: user.getEmail(),
                password: user.getPassword()
            }
        });
        user.setId(id)
    }
}
