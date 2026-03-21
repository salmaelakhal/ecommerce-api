import express from "express";
import type { Request, Response, Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/erros";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter);
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
