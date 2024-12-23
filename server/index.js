import express from 'express';
import cors from 'cors';
import { PORT,db } from './env.js';
import dotenv from 'dotenv';
import contactUsRouter from './routes/contactUs-route.js';
import masterDataRouter from './routes/masterData-route.js';
import productDataRouter from './routes/productdata-route.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'images' directory
app.use('/images', express.static('images'));
//parth - conatct us
app.use('/api/contactus', contactUsRouter);
//parth for master data
app.use('/api/masterdata', masterDataRouter);
//part for product data
app.use('/api/productdata', productDataRouter);

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
