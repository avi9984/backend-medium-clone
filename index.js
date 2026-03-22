import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
const app = express();
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import postRouter from './routes/post.js';
import commentRouter from './routes/comment.js';

dotenv.config({ path: [".env.local", ".env"], debug: false },);
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));
app.use(cors("*"));

mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB is connected')
).catch((err) => console.log(err));


app.use('/api/v1/users/', userRouter);
app.use('/api/v1/categories/', categoryRouter);
app.use('/api/v1/posts/', postRouter);
app.use('/api/v1/comments/', commentRouter);


app.get('/', (req, res) => {
    res.send(`<h1>Welcome to blogyTech</h1>`)
});

app.listen(PORT, () => {
    console.log(`Server is listend on port http://localhost:${PORT}`);
})
