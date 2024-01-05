import express from 'express';
import cors from 'cors';
import { Task, User, Token } from './db.js';

const PORT = 8001;

const app = express();

app.use(express.json());
app.use(cors());

app.use(async (req, _res, next) => {
    const {
        headers: { token },
    } = req;

    const tokenBody = await Token.findOne({ token });

    if (tokenBody) {
        const { userId } = tokenBody;

        req.userId = userId;
    }

    next();
});

app.get('/api/todolist/tasks', async ({ userId }, res) => {
    console.log('/api/todolist/tasks');

    const tasks = await Task.find({ userId });

    res.send(tasks);
});

app.post(
    '/api/todolist/add-new-task',
    async ({ userId, body: newTaskData }, res) => {
        await Task.create({ ...newTaskData, userId });

        res.end();
    }
);

app.delete(
    '/api/todolist/delete-item/:id',
    async ({ userId, params: { id } }, res) => {
        await Task.findOneAndDelete({ _id: id, userId });

        res.end();
    }
);

app.put(
    '/api/todolist/change-existing-task/:id',
    async ({ userId, params: { id }, body: { title } }, res) => {
        await Task.findOneAndUpdate({ _id: id, userId }, { title });

        res.end();
    }
);

app.use('/api/user', async ({ userId }, res) => {
    const user = await User.findById(userId);

    res.send(user);
});

// Login api

app.post('/api/login', async (req, res) => {
    const loginData = req.body;

    const isExist = await User.exists({ email: loginData.email });

    if (!isExist) {
        res.status(400).end(`This email doesn't exist`);

        return;
    }

    const user = await User.findOne({
        email: loginData.email,
        password: loginData.password,
    });

    if (user) {
        const token = `token-${new Date().toISOString()}`;

        await Token.create({ token, userId: user._id });

        res.send(token);
    } else {
        res.status(400).end(`This email or this password doesn't match`);
    }
});

//Log out api

app.delete(`/api/logout`, async ({ headers: { token } }, res) => {
    await Token.findOneAndDelete({ token });

    res.end();
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
