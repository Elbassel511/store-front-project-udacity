import express from "express";
import { Product, ProductTable } from "../models/product";

const product = new ProductTable();
export const productRoutes = express.Router();

const create = async (req: express.Request, res: express.Response) => {
  const name: string = req.body.name;
  const price: number = Number(req.body.price);
  const stock: number = Number(req.body.stock);

  // Data validation

  if (!name || !price || !stock) {
    res.status(400).send("Invalid request");
    return;
  }

  await product
    .create({
      name,
      price,
      stock,
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500);
      throw new Error(err);
    });
};

const del = async (req: express.Request, res: express.Response) => {
  const id: number = Number(req.params.id);

  if (!id) {
    res.status(400).send("Invalid request");
    return;
  }

  await product.delete(id).then((data) => {
    res.status(200).json(data);
  });
};

const show = async (req: express.Request, res: express.Response) => {
  const id: number = Number(req.params.id);
  if (!id) {
    res.status(400).send("Invalid request");
    return;
  }
  await product.show(id).then((data) => {
    res.status(200).json(data);
  });
};

const index = async (req: express.Request, res: express.Response) => {
  await product
    .index()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const update = async (req: express.Request, res: express.Response) => {
  const id: number = Number(req.params.id);
  if (!id) {
    res.status(400).send("Invalid request");
    return;
  }

  const oldData = await product.show(id);
  const name = req.body.name || oldData.name;
  const stock = Number(req.body.stock) || oldData.stock;
  const price = Number(req.body.price) || oldData.price;

  const newData: Product = { id, name, stock, price };
  await product
    .update(newData)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

productRoutes.post("/", create);
productRoutes.delete("/:id", del);
productRoutes.get("/:id", show);
productRoutes.get("/", index);
productRoutes.put("/:id", update);
