import express from "express";
import { Order, order, Status, order_product } from "../models/order";
import orderStatusCheck from "./helpers/orderStatusCheck";
import jwtAuth from "./helpers/jwtAuth";
import idCheck from "./helpers/idCheck";

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
  const id: number = Number(req.params.orderId);
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
  const customer_id: number = Number(req.body.customer_id);

  const status = "open";

  if (!customer_id) {
    res.status(400).json("Invalid request !");
    return;
  }
  await newOrder
    .create({ status, customer_id })
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const del = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id: number = Number(req.params.orderId);
  if (!id) {
    res.status(400).json("Invalid Request !");
  }
  await newOrder
    .delete(id)
    .then(() => res.status(200).json(`order deleted successfully`))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const update = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const isOpen = req.body.isOpen as boolean;
  const order_id = Number(req.params.orderId);
  if (isOpen === undefined || !order_id) {
    res.status(400).json("Invalid Request !");
    return;
  }
  const status: Status = isOpen ? "open" : "closed";

  await newOrder
    .update(status, order_id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

// ------------------------------------------------------------------------//
//                          products in order                             //
//  ----------------------------------------------------------------------//
const OrderProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id = Number(req.params.orderId);
  if (!id) {
    res.status(400).json("Invalid Request !");
  }
  await newOrder
    .getorderProducts(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const OrderProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id = Number(req.params.orderId);
  const productId = Number(req.params.productId);
  if (!id || !productId) {
    res.status(400).json("Invalid Request !");
  }

  await newOrder
    .getProductInOrder(productId, id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const createOrderProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const order_id = Number(req.params.orderId);
  const product_id = Number(req.params.productId);
  const quantity = Number(req.body.quantity) || 1;
  if (!order_id || !product_id) {
    res.status(400).json("Invalid Request !");
  }
  newOrder
    .addProduct({ order_id, product_id, quantity })
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

const delOrderProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const order_id = Number(req.params.orderId);
  const product_id = Number(req.params.productId);
  if (!order_id || !product_id) {
    res.status(400).json("Invalid Request !");
  }
  newOrder
    .removeorderProduct(product_id, order_id)
    .then(() => res.status(200).json("product removed succefully"))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};
const updateOrderProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const order_id = Number(req.params.orderId);
  const product_id = Number(req.params.productId);
  const quantity = req.body.quantity;

  if (!order_id || !product_id) {
    res.status(400).json("Invalid Request !");
  }
  const OrderProduct: order_product = { order_id, product_id, quantity };
  newOrder
    .updateorderProduct(OrderProduct)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      throw new Error(err as unknown as string);
    });
};

// -----------------------------------------------------------------------//
//                                 Router                                 //
// -----------------------------------------------------------------------//

export const orderRouter = express.Router();
orderRouter.get("/", index);
orderRouter.get("/:orderId", show);
orderRouter.post("/", jwtAuth, idCheck, create);
orderRouter.delete("/:orderId", jwtAuth, idCheck, del);
orderRouter.put("/:orderId", jwtAuth, idCheck, update);

// products in order routes
orderRouter.get("/:orderId/products", OrderProducts);
orderRouter.get("/:orderId/product/:productId", OrderProduct);
orderRouter.put(
  "/:orderId/product/:productId",
  jwtAuth,
  idCheck,
  orderStatusCheck,
  updateOrderProduct
);
orderRouter.delete(
  "/:orderId/product/:productId",
  jwtAuth,
  idCheck,
  orderStatusCheck,
  delOrderProduct
);
orderRouter.post(
  "/:orderId/product/:productId",
  jwtAuth,
  idCheck,
  orderStatusCheck,
  createOrderProduct
);
