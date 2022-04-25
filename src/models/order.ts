import client from "../database";

type Status = "closed" | "opened";

export type order = {
  id?: number;
  status: Status;
  customer_id: number;
};

export type order_product = {
  id?: number;
  quantity?: number;
  order_id: number;
  product_id: number;
};

export class Order {
  async index(): Promise<order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const data = await conn.query(sql);
      conn.release();
      return data.rows;
    } catch (err) {
      throw new Error(`Couldn't get orders data. Error: ${err}`);
    }
  }

  async show(id: string): Promise<order> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get order data. Error:${err}`);
    }
  }

  async create(order: order): Promise<order> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO orders (status,customer_id) VALUES ($1,$2) RETURNING *";
      const data = await conn.query(sql, [order.status, order.customer_id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't create order. Error:${err}`);
    }
  }

  async delete(id: number): Promise<order> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM orders WHERE id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't delete order. Error:${err}`);
    }
  }

  async update(order: order): Promise<order> {
    try {
      const conn = await client.connect();
      const sql = "UPDATE orders SET status = $2 WHERE id = $1 RETURNING *";
      const data = await conn.query(sql, [order.id, order.status]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update order. Error:${err}`);
    }
  }
  // ---------------------------order products methods (order status should be checked)-----------------------------------------

  async addProduct(orderProduct: order_product): Promise<order_product> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1,$2,$3) RETURNING *";
      const data = await conn.query(sql, [
        orderProduct.quantity,
        orderProduct.order_id,
        orderProduct.product_id,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update order. Error:${err}`);
    }
  }

  async getorderProducts(id: number): Promise<order_product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM order_products WHERE order_id = $1";
      const data = await conn.query(sql, [id]);
      conn.release();
      return data.rows;
    } catch (err) {
      throw new Error(`couldn't update order. Error:${err}`);
    }
  }

  async updateorderProduct(
    order_products: order_product
  ): Promise<order_product> {
    try {
      const conn = await client.connect();
      const sql =
        "UPDATE order_products SET quantity =$1 WHERE order_id = $2 AND product_id = $3 RETURNING * ";
      const data = await conn.query(sql, [
        order_products.quantity,
        order_products.order_id,
        order_products.product_id,
      ]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update order. Error:${err}`);
    }
  }

  async removeorderProduct(
    product_id: number,
    order_id: number
  ): Promise<order_product> {
    try {
      const conn = await client.connect();
      const sql =
        "DELETE FROM order_products WHERE order_id = $1 AND product_id = $2 ";
      const data = await conn.query(sql, [order_id, product_id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't update order. Error:${err}`);
    }
  }

  async getProductInOrder(
    product_id: number,
    order_id: number
  ): Promise<order_product> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT * FROM order_products WHERE order_id = $1 AND product_id = $2 ";
      const data = await conn.query(sql, [order_id, product_id]);
      conn.release();
      return data.rows[0];
    } catch (err) {
      throw new Error(`couldn't get data. Error:${err}`);
    }
  }
}
