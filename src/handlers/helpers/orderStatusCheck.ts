// middle-ware to check for order status before handling products in order
import express from "express";
import { Order } from "../../models/order";

const order = new Order();

const orderStatusCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json("Invalid Request !");
  }
  if ((await order.show(id)).status === "closed") {
    res.status(400).json("order is closed!");
    return;
  }
  next();
};

export default orderStatusCheck;
