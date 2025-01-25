import express from 'express';
import cors from 'cors';
import { PORT,db } from './env.js';
import dotenv from 'dotenv';
import contactUsRouter from './routes/contactUs-route.js';
import masterDataRouter from './routes/masterData-route.js';
import productDataRouter from './routes/productdata-route.js';
import materialDataRouter from './routes/materialData-route.js';
import authRouter from './routes/auth-route.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'images' directory
app.use('/images', express.static('images'));
//parth - conatct us
app.use('/api/contactus', contactUsRouter);
//parth - master data
app.use('/api/masterdata', masterDataRouter);
//part - product data
app.use('/api/productdata', productDataRouter);
//part - material data
app.use('/api/materialdata', materialDataRouter);
//part - auth
app.use('/api/auth', authRouter);

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
