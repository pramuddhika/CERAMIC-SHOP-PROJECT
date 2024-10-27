import express from 'express';
import cors from 'cors';
import { PORT,db } from './env.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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
