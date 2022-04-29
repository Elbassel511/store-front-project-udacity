import { Product, ProductTable } from "../../models/product";
const dummyProduct: Product = {
  id: 1,
  name: "A",
  price: 10.11,
  stock: 10,
};
const product = new ProductTable();

describe("product model", () => {
  it("should have an index method", () => {
    expect(product.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(product.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(product.create).toBeDefined();
  });

  it("should have a update method", () => {
    expect(product.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(product.delete).toBeDefined();
  });
  it("create method should add a product", async () => {
    const result = await product.create(dummyProduct);
    expect(result).toEqual(dummyProduct);
  });

  it("index method should return a list of products", async () => {
    const result = await product.index();
    expect(result).toEqual([dummyProduct]);
  });

  it("show method should return the correct product", async () => {
    const result = await product.show(1);
    expect(result).toEqual(dummyProduct);
  });

  it("update method product data ", async () => {
    const result = await product.update({ ...dummyProduct, name: "B" });
    expect(result.name).toEqual("B");
  });

  it("delete method should remove the product", async () => {
    await product.delete(1);
    const result = await product.index();
    expect(result).toEqual([]);
  });
});
