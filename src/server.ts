import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import PrettyError from "pretty-error";
import { productRoutes } from "./handlers/products";
import { customerRouter } from "./handlers/customers";
import { orderRouter } from "./handlers/order";
import { adminRouter } from "./handlers/admin";

export const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(morgan("tiny"));
app.use(helmet());
app.use(bodyParser.json());
PrettyError.start();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/products", productRoutes);
app.use("/customers", customerRouter);
app.use("/admins", adminRouter);
app.use("/customer", orderRouter);

// handling not found routes
app.use(
  (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(404).json("couldn't find that !");
  }
);

// handling errors
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.message, 500);
    res.status(500).json("something went wrong !");
    next();
  }
);
app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
