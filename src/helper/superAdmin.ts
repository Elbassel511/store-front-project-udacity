// create a super admin only for first time if it doesn't exist
import { AdminIns, Role } from "../models/admin";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const { PEPPER, SALT_ROUNDS, SUPER_ADMIN_NAME, SUPER_ADMIN_PASSWORD } =
  process.env;
const admin = new AdminIns();
let res: string;

const createSuperAdmin = async (): Promise<string> => {
  try {
    //   check if there is another super Admin
    const isSuperExist: Boolean = await admin
      .superAdminSearch()
      .then((data) => {
        if (data.length === 0) return false;
        return true;
      });

    if (!SUPER_ADMIN_NAME || !SUPER_ADMIN_NAME) {
      console.error("name or password are missing");
      res = "name or password are missing";
      return res;
    }

    const name = SUPER_ADMIN_NAME as unknown as string;
    const role: Role = "superAdmin";
    const password = bcrypt.hashSync(
      // @ts-ignore
      SUPER_ADMIN_PASSWORD + PEPPER,
      Number(SALT_ROUNDS)
    );

    if (isSuperExist) {
      console.error("SUPER ADMIN ALREADY EXIST");
      return "SUPER ADMIN ALREADY EXIST";
    }
    const data = await admin
      .create({
        name,
        password,
        role,
      })
      .then((data) => {
        console.info("SUPER ADMIN CREATED");
        return data;
      });
    return "SUPER ADMIN CREATED";
  } catch (err) {
    console.error(err);
    return err as unknown as string;
  }
};
export default createSuperAdmin;
