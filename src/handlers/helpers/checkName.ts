// middle-ware to check if email is exist before making new customer
import express from "express";
import { AdminIns } from "../../models/admin";

const admin = new AdminIns();
const checkName = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const name = req.body.name as unknown as string;
    let data = await admin.auth(name);
    if (data) {
      res.status(400).json("name already exist");
      return;
    }
    next();
  } catch (err) {
    throw new Error(err as unknown as string);
  }
};

export default checkName;
