import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import morgan from "morgan";
import {createProxyMiddleware} from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());

const API_SERVICE_URL = process.env.RIBBON_URL;
console.log(API_SERVICE_URL);

app.use(createProxyMiddleware({
        target: API_SERVICE_URL,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res, options) => {
            if (process.env.RIBBON_ENV === "development")
            {
                proxyReq.setHeader("x-api-key", process.env.RIBBON_KEY);
            }
            else {
                proxyReq.setHeader("authentication", `Token ${process.env.RIBBON_KEY}`);
            }
        }
    })
);

//app.use("/providers", router)
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
