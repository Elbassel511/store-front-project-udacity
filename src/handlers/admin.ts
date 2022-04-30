import express from "express";
import { Admin, AdminIns, Role } from "../models/admin";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtAuth from "./helpers/jwtAuth";
import idCheck from "./helpers/idCheck";
import roleCheck from "./helpers/roleCheck";
// need role check
dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;
const admin = new AdminIns();

export const adminRouter = express.Router();

const create = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { name }: Admin = req.body;
  const role: Role = "admin";
  const password = bcrypt.hashSync(
    req.body.password + PEPPER,
    Number(SALT_ROUNDS)
  );

  if (!name || !password) {
    res.status(400).send("Invalid data");
    return;
  }

  await admin
    .create({
      name,
      password,
      role,
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const show = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  await admin
    .show(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const index = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  await admin
    .index()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const update = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const oldData = await admin.show(id);
    const name = req.body.name || oldData.name;
    const role = oldData.role;
    const password = req.body.password
      ? bcrypt.hashSync(req.body.password + PEPPER, Number(SALT_ROUNDS))
      : oldData.password;
    const newData: Admin = {
      id,
      name,
      role,
      password,
    };
    const data = await admin.update(newData);
    res.status(200).json(data);
  } catch (err) {
    throw new Error(err as unknown as string);
  }
};

const del = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  await admin
    .delete(id)
    .then((data) =>
      res.status(200).send(`admin with id: ${id} successfully deleted`)
    )
    .catch((err) => {
      throw new Error(err);
    });
};

const auth = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const name: string = req.body.name;
  const password: string = req.body.password;
  if (!name || !password) {
    res.status(400).send("Invalid Request");
  }
  const user: Admin = await admin.auth(name);
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

const createSuper = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { name }: Admin = req.body;
  const role: Role = "superAdmin";
  const password = bcrypt.hashSync(
    req.body.password + PEPPER,
    Number(SALT_ROUNDS)
  );

  if (!name || !password) {
    res.status(400).send("Invalid data");
    return;
  }

  //   check if there is another super Admin
  const isSuperExist: Boolean = await admin
    .superAdminSearch()
    .then((data) => {
      if (data.length === 0) return false;
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });

  if (isSuperExist) {
    res.status(401).json("Super Admin Already Exist");
    return;
  } else {
    await admin
      .create({
        name,
        password,
        role,
      })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
};

adminRouter.post("/", jwtAuth, roleCheck, create);
adminRouter.post("/super", createSuper);
adminRouter.delete("/:id", jwtAuth, roleCheck, del);
adminRouter.get("/:id", show);
adminRouter.get("/", jwtAuth, roleCheck, index);
adminRouter.put("/:id", jwtAuth, idCheck, update);
adminRouter.post("/auth", auth);
