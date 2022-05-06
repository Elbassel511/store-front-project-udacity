import express from "express";
import { Customer, CustomerTable } from "../models/customer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtAuth from "./helpers/jwtAuth";
import idCheck from "./helpers/idCheck";
import checkEmail from "./helpers/checkEmail";

dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;
const customer = new CustomerTable();

export const customerRouter = express.Router();

const create = async (req: express.Request, res: express.Response) => {
  try {
    const { first_name, password, last_name, email }: Customer = req.body;
    if (!first_name || !password || !email) {
      res.status(400).send("Invalid request data ");
      throw new Error("bad request");
    }
    const hashedPassword = bcrypt.hashSync(
      req.body.password + PEPPER,
      Number(SALT_ROUNDS)
    );

    const newCustomer: Customer = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };
    const data = await customer.create(newCustomer);
    res.status(200).json(data);
  } catch (err) {
    throw new Error(`couldn't create customer ${err}`);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  await customer
    .show(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const index = async (req: express.Request, res: express.Response) => {
  await customer
    .index()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const update = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const oldData = await customer.show(id);
    const first_name = req.body.first_name || oldData.first_name;
    const last_name = req.body.last_name || oldData.last_name;
    const email = req.body.email || oldData.email;
    const password = req.body.password
      ? bcrypt.hashSync(req.body.password + PEPPER, Number(SALT_ROUNDS))
      : oldData.password;
    const newData: Customer = {
      id,
      first_name,
      last_name,
      email,
      password,
    };
    const data = await customer.update(newData);
    res.status(200).json(data);
  } catch (err) {
    throw new Error(err as unknown as string);
  }
};

const del = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  await customer
    .delete(id)
    .then((data) =>
      res.status(200).send(`customer with id: ${id} successfully deleted`)
    )
    .catch((err) => {
      throw new Error(err);
    });
};

const auth = async (req: express.Request, res: express.Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  if (!email || !password) {
    res.status(400).send("Invalid Request");
  }
  const user: Customer = await customer.auth(email);
  const hashedPassword: string = user.password;

  if (bcrypt.compareSync(password + PEPPER, hashedPassword)) {
    const token: string = jwt.sign(
      user,
      process.env.TOKEN_SECRET as unknown as string
    );
    res.status(200).json(token);
  } else {
    res.status(401).send("wrong password or email !");
  }
};

customerRouter.post("/", checkEmail, create);
customerRouter.delete("/:id", jwtAuth, idCheck, del);
customerRouter.get("/:id", jwtAuth, show);
customerRouter.get("/", jwtAuth, index);
customerRouter.put("/:id", jwtAuth, idCheck, update);
customerRouter.post("/auth", auth);
