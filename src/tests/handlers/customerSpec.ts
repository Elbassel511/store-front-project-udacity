import supertest from "supertest";
import { app } from "../../server";
import { Customer, CustomerTable } from "../../models/customer";

const request = supertest(app);

const customer = new CustomerTable();
const dummyCustomer: Customer = {
  id: 3,
  first_name: "customer end point test",
  last_name: "B",
  email: "A@b.c",
  password: "123",
};

describe("Test for customer model end point", () => {
  let token: string;
  it("adds a customer ", async () => {
    const response = await request.post("/customers/").send(dummyCustomer);
    expect(response.status).toBe(200);
    expect(response.body.first_name).toEqual("customer end point test");
  });
  it("reject to add a customer with the same email", async () => {
    const response = await request.post("/customers/").send(dummyCustomer);
    expect(response.status).toBe(400);
  });

  it("login and send back token", async () => {
    const response = await request
      .post("/customers/auth")
      .send({ email: "A@b.c", password: "123" });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
    token = response.body;
  });

  it("should get back an array of customers", async () => {
    const response = await request
      .get("/customers/")
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
  });
  it("should get back customer", async () => {
    const response = await request
      .get("/customers/3")
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
    expect(response.body.first_name).toEqual("customer end point test");
  });
  it("delete customer request with token accepted", async () => {
    const response = await request.delete("/customers/3");
    expect(response.status).toBe(401);
    expect(response).toThrowError;
  });
  it("update customer request without token rejected", async () => {
    const response = await request.put("/customers/3").send({ email: "b@A.c" });
    expect(response.status).toBe(401);
    expect(response).toThrowError;
  });
  it("update customer request with token accepted", async () => {
    const response = await request
      .put("/customers/3")
      .send({ email: "b@A.c" })
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("b@A.c");
  });
  it("delete customer request with token accepted", async () => {
    const response = await request
      .delete("/customers/3")
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
  });
});
