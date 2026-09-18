import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "ISLQuest API is running"
    });
});

app.use(errorHandlerMiddleware);

export default app;