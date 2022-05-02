// middle-ware to check if email is exist before making new customer
import express from "express";
import { CustomerTable } from "../../models/customer";

const customer = new CustomerTable();
const checkEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const email = req.body.email as unknown as string;
    let data = await customer.auth(email);
    if (data) {
      res.status(400).json("email already exist");
      return;
    }
    next();
  } catch (err) {
    throw new Error(err as unknown as string);
  }
};

export default checkEmail;
