import express from "express";
import { globalErrorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

// import routes
import categoryRouter from "./routes";

const app = express();

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("From Category Service");
});

// routes
app.use("/category", categoryRouter);

app.use(globalErrorHandler);

export default app;
