import express from 'express';
import cors from 'cors';
import { Task } from './db.js';

const PORT = 8001;

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/todolist/get-all-items', async (_req, res) => {
    console.log('/api/todolist/get-all-items');

    const tasks = await Task.find();

    res.send(tasks);
});

app.post('/api/todolist/add-new-task', async (req, res) => {
    const newItem = req.body;

    await Task.create(newItem);

    res.end();
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running ${PORT}`);
});
