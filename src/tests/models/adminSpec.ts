import { AdminIns, Admin } from "../../models/admin";

const admin = new AdminIns();
const dummyAdmin: Admin = {
  id: 1,
  name: "A",
  password: "B",
  role: "admin",
};

describe("Admins model", () => {
  it("should have an index method", () => {
    expect(admin.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(admin.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(admin.create).toBeDefined();
  });

  it("should have a update method", () => {
    expect(admin.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(admin.delete).toBeDefined();
  });

  it("create method should add a admin", async () => {
    const result = await admin.create(dummyAdmin);

    expect(result).toEqual(dummyAdmin);
  });

  it("index method should return a list of customers", async () => {
    const result = await admin.index();
    expect(result).toEqual([dummyAdmin]);
  });

  it("show method should return the correct admin", async () => {
    const result = await admin.show(1);
    expect(result).toEqual(dummyAdmin);
  });

  it("delete method should remove the admin", async () => {
    await admin.delete(1);
    const result = await admin.index();

    expect(result).toEqual([]);
  });
});
