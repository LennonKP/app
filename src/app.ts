import express from 'express';
import formidable from 'formidable';

import PrismaUserRepository from './infra/prisma/repositories/PrismaUserRepository';
import BcryptHashProvider from './infra/providers/bcryptHashProvider';
import JsonWebTokenProvider from './infra/providers/jsonwebtokenJwtProvider';
import PrismaPostRepository from './infra/prisma/repositories/PrismaPostRepository';
import AuthService from './application/services/AuthService';
import PostService from './application/services/PostService';
import { loginSchema, registerSchema } from './infra/http/schemas/AuthSchema';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./src/views");

const images: any[] = [];
const postRepository = new PrismaPostRepository()
const postService = new PostService(postRepository)

const userRepository = new PrismaUserRepository()
const hashProvider = new BcryptHashProvider()
const jwtProvider = new JsonWebTokenProvider()
const authService = new AuthService(userRepository, hashProvider, jwtProvider)

const authRequired = async (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/login');

        const data = await jwtProvider.verify(token);
        if (!data) return res.redirect('/login');
        req.user = data;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
}

app.get('/login', (_req, res) => {
    res.render('auth_login', { title: 'Login' });
});

app.get('/register', (_req, res) => {
    res.render('auth_register', { title: 'Registro' });
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body)
        const { token } = await authService.login(email, password)
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/')
    } catch (error: any) {
        res.render('auth_login', { title: 'Login', error: error.message });
    }
});

app.post('/auth/register', async (req, res) => {
    try {
        const { email, name, password } = registerSchema.parse(req.body)
        const { token } = await authService.register(name, email, password)
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/')
    } catch (error: any) {
        res.render('auth_register', { title: 'Registro', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.render('home', { images });
})

app.get('/publish', (req, res) => {
    res.render('publish')
})

app.post('/publish', (req, res, next) => {
    // prod/users/1235314123/fotos
    const form = formidable({
        uploadDir: "../app/public/uploads",
        // uploadDir: `../app/uploads/${req.user.id}/`,
        createDirsFromUploads: true,
        keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        if (!files.imagem) {
            next(err);
            return;
        }

        // s3Service.upload(file);
        images.push(files.imagem[0].newFilename);
        res.json({ fields, files });
    });

})

app.use((_req, res) => {
    res.status(404).send("NOT FOUND");
})

app.listen(3000, _  => console.log("ESCUTANDO NA PORTA 3000"));