import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import { Customer, CustomerTable } from "./models/customer";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(morgan("tiny"));
app.use(helmet());
app.use(bodyParser.json());

app.get("/", async (req: Request, res: Response) => {
  const customer = new CustomerTable();
  const result = await customer.create({
    id: 1,
    first_name: "ABC",
    last_name: "ABC",
    email: "A@B.c",
    password: "123",
  });
  console.log(result);

  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
