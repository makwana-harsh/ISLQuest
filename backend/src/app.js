import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';


import authRoutes from "./modules/auth/auth.routes.js";
import dictionaryRoutes from "./modules/dictionary/dictionary.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));



app.use("/api/auth", authRoutes);
app.use("/api/dictionary", dictionaryRoutes);

app.use(errorHandlerMiddleware);

export default app;