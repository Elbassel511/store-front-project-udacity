import supertest from "supertest";
import { app } from "../../server";
import { Product, ProductTable } from "../../models/product";
import { AdminIns } from "../../models/admin";

// productRoutes.post("/", jwtAuth, adminCheck, create);
// productRoutes.delete("/:id", jwtAuth, adminCheck, del);
// productRoutes.get("/:id", show);
// productRoutes.get("/", index);
// productRoutes.put("/:id", jwtAuth, adminCheck, update);

const dummyProduct: Product = {
  name: "A",
  price: 10.11,
  stock: 10,
};
let token: string;
const request = supertest(app);
const admin = new AdminIns();

describe("Test for products model end point", () => {
  beforeAll(async () => {
    const response = await request
      .post("/admins/auth")
      .send({ name: "B", password: "123" });
    token = response.body;
  });
  it("adds a product ", async () => {
    const response = await request
      .post("/products")
      .send(dummyProduct)
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("A");
  });

  it("should get back an array of products", async () => {
    const response = await request.get("/products/");
    expect(response.status).toBe(200);
  });
  it("should get back product", async () => {
    const response = await request.get("/products/3");
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("A");
  });

  it("update product ", async () => {
    const response = await request
      .put("/products/3")
      .send({ stock: 7 })
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
    expect(response.body.stock).toBe(7);
  });
  it("delete product", async () => {
    const response = await request
      .delete("/products/3")
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
  });
});
