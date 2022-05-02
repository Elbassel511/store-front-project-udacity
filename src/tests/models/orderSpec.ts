import { order, Order, order_product } from "../../models/order";
import { CustomerTable, Customer } from "../../models/customer";
import { ProductTable, Product } from "../../models/product";

const newOrder = new Order();

const dummyOrder: order = {
  id: 1,
  status: "open",
  customer_id: 2,
};
const dummycustomer: Customer = {
  id: 2,
  email: "A@B.c",
  first_name: "A",
  last_name: "B",
  password: "123",
};
const dummyOrderProduct: order_product = {
  id: 1,
  quantity: 10,
  order_id: 1,
  product_id: 2,
};
const dummyProduct: Product = {
  id: 2,
  name: "A",
  price: 10.11,
  stock: 5,
};
const customer = new CustomerTable();
const product = new ProductTable();

describe("order model", () => {
  beforeAll(() => customer.create(dummycustomer));

  describe("order methods", () => {
    it("should have an index method", () => {
      expect(newOrder.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(newOrder.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(newOrder.create).toBeDefined();
    });

    it("should have a update method", () => {
      expect(newOrder.update).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(newOrder.delete).toBeDefined();
    });
    it("create method should add a Order", async () => {
      const result = await newOrder.create(dummyOrder);
      expect(result).toEqual(dummyOrder);
    });

    it("index method should return a list of Orders", async () => {
      const result = await newOrder.index();
      expect(result).toEqual([dummyOrder]);
    });

    it("show method should return the correct newOrder", async () => {
      const result = await newOrder.show(1);
      expect(result).toEqual(dummyOrder);
    });

    it("update method newOrder data ", async () => {
      const result = await newOrder.update(
        "closed",
        dummyOrder.id as unknown as number
      );
      expect(result.status).toEqual("closed");
    });
  });

  beforeAll(() => product.create(dummyProduct));

  describe("products in order methods", () => {
    it("add product to an order", async () => {
      const result = await newOrder.addProduct(dummyOrderProduct);
      expect(result).toEqual(dummyOrderProduct);
    });

    it("get all product in an order", async () => {
      const result = await newOrder.getorderProducts(1);
      expect(result).toEqual([dummyOrderProduct]);
    });
    it("update products in order", async () => {
      const result = await newOrder.updateorderProduct({
        ...dummyOrderProduct,
        quantity: 20,
      });
      expect(result).toEqual({ ...dummyOrderProduct, quantity: 20 });
    });
    it("remove product from order", async () => {
      await newOrder.removeorderProduct(
        dummyOrderProduct.product_id,
        dummyOrderProduct.order_id
      );
      const result = newOrder.getProductInOrder(
        dummyOrderProduct.product_id,
        dummyOrderProduct.order_id
      );
      expect(result).toBeUndefined;
    });
  });
  it("delete method should remove the Order", async () => {
    await newOrder.delete(1);
    const result = await newOrder.index();
    expect(result).toEqual([]);
  });
  afterAll(() => customer.delete(2));
});
