import mongoose from 'mongoose';

await mongoose.connect(
    'mongodb+srv://olgaorlova241:druYgJ4o6vMYg4Q7@cluster0.e3sqktx.mongodb.net/todolist?retryWrites=true&w=majority'
);
// await mongoose.connect('mongodb://127.0.0.1:27017/todolist');

export const Task = mongoose.model('Task', { title: String });
