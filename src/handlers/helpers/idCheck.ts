import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Customer } from "../../models/customer";

dotenv.config();

const idCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const id = Number(req.params.customerId);
  const authorizationHeader = req.headers.authorization as unknown as string;
  const token = authorizationHeader.split(" ")[1];

  try {
    // @ts-ignore
    const decoded: Customer = jwt.verify(
      token,
      process.env.TOKEN_SECRET as unknown as string
    );
    if (decoded.id !== id) {
      throw new Error("User id does not match!");
    }

    next();
  } catch (err) {
    res.status(401).send("Access denied");
    return;
  }
};

export default idCheck;
