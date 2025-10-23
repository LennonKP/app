import express from 'express';
import formidable from 'formidable';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./src/views");

const images: any[] = [];

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

app.get('/login', (_req, res) => {
    res.render('auth_login', { title: 'Login' });
});

app.get('/register', (_req, res) => {
    res.render('auth_register', { title: 'PRegistro' });
});

app.post('/auth/login', (req, res) => {
    console.log('Dados do Login:', req.body);
    res.redirect('/login');
});

type RegisterDTO = {
    email: string;
    password: string;
    confirm_password: string;
}

app.post('/auth/register', (req, res) => {
    
});

app.use((_req, res) => {
    res.status(404).send("NOT FOUND");
})

app.listen(PORT, () => {
    console.log("ESCUTANDO NA PORTA 3000");
});