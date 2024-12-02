import express from 'express';
import cors from 'cors';
import { PORT,db } from './env.js';
import dotenv from 'dotenv';
import contactUsRouter from './routes/contactUs-route.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//parth - conatct us
app.use('/api/contactus', contactUsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db.getConnection((err) => {
  if (err) {
    console.log('Database connection issue:',err);
  } else {
    console.log('Database is connected');
  }
});
