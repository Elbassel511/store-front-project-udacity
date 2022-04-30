import client from "../database";

export type Role = "superAdmin" | "admin";

export type Admin = {
  id?: number;
  name: string;
  password: string;
  role: Role;
};

export class AdminIns {
  create = async (admin: Admin): Promise<Admin> => {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO admins (name,password,role) VALUES ($1,$2,$3) RETURNING *";
      const data = await conn.query(sql, [
        admin.name,
        admin.password,
        admin.role,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`cannot create admin Error : ${err}`);
    }
  };

  async index(): Promise<Admin[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM admins";
      const data = await conn.query(sql);
      conn.release();
      return data.rows;
    } catch (err) {
      throw new Error(`Couldn't get admin data. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Admin> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM admins WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get admin data. Error:${err}`);
    }
  }

  async delete(id: number): Promise<Admin> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM admins WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't delete admin. Error:${err}`);
    }
  }

  async update(admin: Admin): Promise<Admin> {
    try {
      const conn = await client.connect();
      const sql = `UPDATE admins SET
         name = $2,  
         password = $3 
         WHERE id = $1 RETURNING * `;
      const data = await conn.query(sql, [
        admin.id,
        admin.name,
        admin.password,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update admin. Error:${err}`);
    }
  }

  async auth(name: string): Promise<Admin> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM admins WHERE name = $1";
      const data = await conn.query(sql, [name]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get data. Error:${err}`);
    }
  }

  async superAdminSearch(): Promise<Admin[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM admins WHERE role = 'superAdmin'";
      const data = await conn.query(sql, []);
      conn.release();
      return data.rows;
    } catch (err) {
      throw new Error(`couldn't get data. Error:${err}`);
    }
  }
}
