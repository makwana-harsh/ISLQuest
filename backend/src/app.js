import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';

import profileRoutes from "./modules/profile/profile.routes.js"
import authRoutes from "./modules/auth/auth.routes.js";
import dictionaryRoutes from "./modules/dictionary/dictionary.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import learnIslRoutes from "./modules/learnIsl/learnIsl.routes.js";
import contributionRoutes from "./modules/contribution/contribution.routes.js";
import moderatorRoutes from "./modules/moderator/moderator.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));


app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/learn-isl", learnIslRoutes);
app.use("/api/contribution",contributionRoutes);
app.use("/api/moderator",moderatorRoutes);

app.use(errorHandlerMiddleware);

export default app;