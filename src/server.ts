import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import { productRoutes } from "./handlers/products";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(morgan("tiny"));
app.use(helmet());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/products", productRoutes);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
