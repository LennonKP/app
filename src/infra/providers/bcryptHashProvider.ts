import { hash, compare } from 'bcrypt';
import { HashProvider } from '../../application/ports/HashProvider';

export default class BcryptHashProvider implements HashProvider {

    async hash(plain: string): Promise<string> {
        return hash(plain, 8);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash);
    }
}