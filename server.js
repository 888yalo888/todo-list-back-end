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

// Step 2: Checking the token
app.use(async (req, _res, next) => {
    const {
        headers: { token },
    } = req;

    if (token) {
        const tokenData = await Token.findOne({
            token,
        });

        if (tokenData) {
            req.userId = tokenData.userId;
        }
    }

    next();
});

app.get('/api/todolist/tasks', async ({ userId }, res) => {
    console.log('/api/todolist/tasks');

    if (userId) {
        const tasks = await Task.find({
            ownerId: userId,
        });

        res.send(tasks);
    } else {
        res.status(400).end("It's private API. Need to login to get tasks");
    }
});

app.post(
    '/api/todolist/add-new-task',
    async ({ userId, body: newTaskData }, res) => {
        if (userId) {
            await Task.create({ ...newTaskData, ownerId: userId });
        }

        res.end();
    }
);

app.delete(
    '/api/todolist/delete-item/:id',
    async ({ userId, params: { id } }, res) => {
        //const token = req.headers.token;
        // const idItem = req.params.id;

        // const { userId } = await Token.findOne({
        //     token,
        // }); // === { _id, token, userId, __v }

        await Task.findOneAndDelete({ _id: id, ownerId: userId });

        res.end();
    }
);

app.put(
    '/api/todolist/change-existing-task/:id',
    async ({ userId, params: { id }, body: { title } }, res) => {
        //const idItem = req.params.id;
        //const newTitle = req.body.title;

        await Task.findOneAndUpdate({ _id: id, ownerId: userId }, { title });

        res.end();
    }
);

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

//Log out api

app.delete(`/api/logout`, async ({ headers: { token } }, res) => {
    await Token.findOneAndDelete({ token });

    res.end();
});

app.get(`/api/user`, async ({ userId }, res) => {
    console.log('api/user ');

    // const token = req.headers.token;

    //const { userId } = tokensStorage[token];
    // const { userId } = await Token.findOne({ token }); //Returns an OBJECT

    const user = await User.findOne({
        _id: userId,
    });

    res.send(user);
});

//Sign up api

app.post(`/api/signup`, async (req, res) => {
    const loginData = req.body;

    const isExists = await User.exists({
        email: loginData.email,
    });

    if (isExists) {
        res.status(400).end('User with this email already exists');

        return;
    }

    const user = await User.create({
        email: loginData.email,
        password: loginData.password,
    });

    const token = `${new Date().toISOString()}-***FOR TEST: ${
        loginData.email
    }***`;

    await Token.create({ token, userId: user._id });

    res.end(token);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running ${PORT}`);
});
