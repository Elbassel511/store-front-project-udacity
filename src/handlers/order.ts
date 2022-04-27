import express from "express";
import { Order, order } from "../models/order";
import client from "../database";

const newOrder = new Order();

const index = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  await newOrder
    .index()
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const show = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id: number = Number(req.params.id);
  if (!id) {
    res.status(400).send("Invalid request");
    return;
  }
  await newOrder
    .show(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const create = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { status, customer_id } = req.params;
  //   to be continued
};

const del = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {};

const update = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {};

export const orderRouter = express.Router();
orderRouter.get("/", index);
orderRouter.get("/:id", show);
orderRouter.post("/", create);
orderRouter.delete("/:id", del);
orderRouter.put("/:id", update);
