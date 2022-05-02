import supertest from "supertest";
import { app } from "../../server";
import { order, Order } from "../../models/order";

let adminToken: string;
let customerToken: string;

const request = supertest(app);
const newOrder = new Order();

describe("*******************Order end points tests*********************", () => {
  beforeAll(async () => {
    try {
      // log in as a super admin to get token
      let response = await request
        .post("/admins/auth")
        .send({ name: "B", password: "123" });
      adminToken = response.body;

      // add a product
      let x = await request
        .post("/products")
        .send({
          name: "A",
          price: 10.11,
          stock: 10,
        })
        .set("Authorization", "bearer " + adminToken);
      // add a customer
      let y = await request.post("/customers/").send({
        id: 4,
        first_name: "A",
        last_name: "B",
        email: "A@b.c",
        password: "123",
      });
      //   get customer token
      response = await request
        .post("/customers/auth")
        .send({ email: "A@b.c", password: "123" });
      customerToken = response.body;
    } catch (err) {
      throw new Error(err as unknown as string);
    }
  });
  // create an order route
  it("create an order", async () => {
    const response = await request
      .post("/customer/4/orders/")
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });
  // get order (1)
  it("get order data", async () => {
    const response = await request.get("/customer/4/orders/2");
    expect(response.status).toBe(200);
  });
  // get orders list
  it("get order list", async () => {
    const response = await request.get("/customer/4/orders");
    expect(response.status).toBe(200);
  });
  // add product to order
  it("add product to order", async () => {
    const response = await request
      .post("/customer/4/orders/2/product/4")
      .send({ quantity: 10 })
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });
  //   get all products in order
  it("get products in order", async () => {
    const response = await request
      .get("/customer/4/orders/2/products")
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });

  //  update product in order
  it("update product to order", async () => {
    const response = await request
      .put("/customer/4/orders/2/product/4")
      .send({ quantity: 5 })
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });

  // delete product from order
  it("delete product from order", async () => {
    const response = await request
      .delete("/customer/4/orders/2/product/4")
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });

  //   update order
  it("update order data", async () => {
    const response = await request
      .put("/customer/4/orders/2")
      .send({ isOpen: false })
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });
  // delete an order
  it("delete order", async () => {
    const response = await request
      .delete("/customer/4/orders/2")
      .set("Authorization", "bearer " + customerToken);
    expect(response.status).toBe(200);
  });
});
