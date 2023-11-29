import mongoose from 'mongoose';

const DB_URL =
    process.env.NODE_ENV === 'development'
        ? 'mongodb://127.0.0.1:27017/todolist'
        : 'mongodb+srv://olgaorlova241:druYgJ4o6vMYg4Q7@cluster0.e3sqktx.mongodb.net/todolist?retryWrites=true&w=majority';

console.log('DB_URL', DB_URL);

await mongoose.connect(DB_URL);

export const Task = mongoose.model('Task', { title: String });
