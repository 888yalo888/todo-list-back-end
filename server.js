import express from 'express';
import cors from 'cors';
import { Task, User, Token } from './db.js';

const PORT = 8001;

//const tokensStorage = {
// '2023-12-06T14:53:29.603Z-***FOR TEST: olga@gmail.com***': {
//     userId: '656e049cc4199bf0c972031a',
// },
//};

// [
// {
//     token: '2023-12-06T14:53:29.603Z-***FOR TEST: olga@gmail.com***',
//     userId: '656e049cc4199bf0c972031a',
// },
// ]

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/todolist/get-all-items', async (req, res) => {
    console.log('/api/todolist/get-all-items');

    const token = req.headers.token;

    //const tokenBody = tokensStorage[token];
    const tokenBody = await Token.findOne({
        token,
    });

    if (tokenBody) {
        const tasks = await Task.find({
            ownerId: tokenBody.userId,
        });

        console.log('tokenBody', tokenBody);

        res.send(tasks);
    }
});

app.post('/api/todolist/add-new-task', async (req, res) => {
    const token = req.headers.token;
    const newItem = req.body;

    //const tokenBody = tokensStorage[token];
    const tokenBody = await Token.findOne({
        token,
    });

    if (tokenBody) {
        await Task.create({ ...newItem, ownerId: tokenBody.userId });

        res.end();
    }
});

app.delete('/api/todolist/delete-item/:id', async (req, res) => {
    const idItem = req.params.id;

    await Task.findByIdAndDelete(idItem);

    res.end();
});

app.put('/api/todolist/change-existing-task/:id', async (req, res) => {
    const newTitleId = req.params.id;
    const newTitle = req.body.title;

    await Task.findByIdAndUpdate(newTitleId, { title: newTitle });

    res.end();
});

// Login api

app.post(`/api/login`, async (req, res) => {
    const loginData = req.body;

    const user = await User.findOne({
        email: loginData.email,
        password: loginData.password,
    });

    if (user) {
        const token = `${new Date().toISOString()}-***FOR TEST: ${
            loginData.email
        }***`;

        console.log('token', token);

        //tokensStorage[token] = { userId: user._id };
        await Token.create({ token, userId: user._id });

        res.end(token);
    } else {
        res.status(401);

        res.end('Login failed');
    }
});

app.get(`/api/user`, async (req, res) => {
    console.log('api/user ');

    const token = req.headers.token;

    //const { userId } = tokensStorage[token];
    const { userId } = await Token.findOne({ token }); //Returns an OBJECT

    const user = await User.findOne({
        _id: userId,
    });

    res.send(user);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running ${PORT}`);
});
