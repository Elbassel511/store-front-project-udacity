import supertest from "supertest";
import { app } from "../../server";
import { Product, ProductTable } from "../../models/product";

// routes to be tested///////////////////////////
// productRoutes.post("/", create);//////////////
// productRoutes.delete("/:id", del);////////////
// productRoutes.get("/:id", show);//////////////
// productRoutes.get("/", index);////////////////
// productRoutes.put("/:id", update);////////////
/////////////////////////////////////////////////
const dummyProduct: Product = {
  name: "A",
  price: 10.11,
  stock: 10,
};

const request = supertest(app);

describe("Test for products model end point", () => {
  let token: string;
  it("adds a product ", async () => {
    const response = await request.post("/products").send(dummyProduct);
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
    const response = await request.put("/products/3").send({ stock: 7 });
    expect(response.status).toBe(200);
    expect(response.body.stock).toBe(7);
  });
  it("delete product", async () => {
    const response = await request.delete("/products/3");
    expect(response.status).toBe(200);
  });
});
