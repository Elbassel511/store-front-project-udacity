import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorizationHeader = req.headers.authorization as unknown as string;

  if (!authorizationHeader) {
    res.status(401).send("Access denied");
    return;
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.TOKEN_SECRET as unknown as string);
    next();
  } catch (err) {
    res.status(401).send("Access denied");
    return;
  }
};

export default jwtAuth;
