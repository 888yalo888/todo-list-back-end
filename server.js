import express from 'express';
import cors from 'cors';
import { Task } from './db.js';

const TODO_LIST_MOCKS = [
    {
        id: '1',
        title: 'Walk the dog',
    },
    {
        id: '2',
        title: 'Do the dishes',
    },
    {
        id: '3',
        title: 'Walk on the street',
    },
];

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/todolist/get-all-items', async (_req, res) => {
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

    // const neededTaskIndex = TODO_LIST_MOCKS.findIndex(
    //     (item) => item.id === newTitleId
    // );

    // TODO_LIST_MOCKS[neededTaskIndex].title = newTitle;

    res.end();
});

app.listen(8001, () => {
    console.log('Server is running');
});
