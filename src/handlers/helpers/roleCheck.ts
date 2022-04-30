// middle-ware to check for super-admin role
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Admin } from "../../models/admin";

dotenv.config();

const roleCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const id = Number(req.params.adminId);
  const authorizationHeader = req.headers.authorization as unknown as string;
  const token = authorizationHeader.split(" ")[1];

  try {
    // @ts-ignore
    const decoded: Admin = jwt.verify(
      token,
      process.env.TOKEN_SECRET as unknown as string
    );
    if (decoded.role !== "superAdmin") {
      res.status(401).send("Access denied , only super admin can Access");
      return;
    }
    next();
  } catch (err) {
    res.status(401).send("Access denied");
    return;
  }
};

export default roleCheck;
