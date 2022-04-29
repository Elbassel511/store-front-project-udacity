import { Customer, CustomerTable } from "../../models/customer";

const customer = new CustomerTable();

describe("customers model", () => {
  it("should have an index method", () => {
    expect(customer.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(customer.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(customer.create).toBeDefined();
  });

  it("should have a update method", () => {
    expect(customer.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(customer.delete).toBeDefined();
  });

  it("create method should add a customer", async () => {
    const result = await customer.create({
      id: 1,
      first_name: "ABC",
      last_name: "ABC",
      email: "A@B.c",
      password: "123",
    });

    expect(result).toEqual({
      id: 1,
      first_name: "ABC",
      last_name: "ABC",
      email: "A@B.c",
      password: "123",
    });
  });

  it("index method should return a list of customers", async () => {
    const result = await customer.index();
    expect(result).toEqual([
      {
        id: 1,
        first_name: "ABC",
        last_name: "ABC",
        email: "A@B.c",
        password: "123",
      },
    ]);
  });

  it("show method should return the correct customer", async () => {
    const result = await customer.show(1);
    expect(result).toEqual({
      id: 1,
      first_name: "ABC",
      last_name: "ABC",
      email: "A@B.c",
      password: "123",
    });
  });

  it("delete method should remove the customer", async () => {
    await customer.delete(1);
    const result = await customer.index();

    expect(result).toEqual([]);
  });
});
