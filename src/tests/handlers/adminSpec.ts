import supertest from "supertest";
import { app } from "../../server";
import { Admin, AdminIns } from "../../models/admin";
import createSuperAdmin from "../../helper/superAdmin";
import dotenv from "dotenv";
dotenv.config();

const request = supertest(app);

// routes to be tested
// adminRouter.post("/", roleCheck, create);
// adminRouter.post("/super", createSuper);
// adminRouter.delete("/:adminId", jwtAuth, roleCheck, del);
// adminRouter.get("/:adminId", show);
// adminRouter.get("/", roleCheck, index);
// adminRouter.put("/:adminId", jwtAuth, idCheck, update);
// adminRouter.post("/auth", auth);

const admin = new AdminIns();
const dummyAdmin: Admin = {
  id: 3,
  name: "A",
  role: "admin",
  password: "123",
};
const dummySuperAdmin: Admin = {
  id: 2,
  name: "B",
  role: "superAdmin",
  password: "123",
};

describe("Test for admin model end point", () => {
  let token: string;
  let adminToken: string;

  it("adds a super Admin ", async () => {
    const result = await createSuperAdmin();
    expect(result).toBe("SUPER ADMIN CREATED");
  });

  it("adds a super Admin rejected if one already exist ", async () => {
    const response = await request.post("/admins/super").send(dummySuperAdmin);
    expect(response.status).toBe(401);
  });

  it("login as super Admin and send back token", async () => {
    const response = await request.post("/admins/auth").send({
      name: process.env.SUPER_ADMIN_NAME,
      password: process.env.SUPER_ADMIN_PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
    token = response.body;
  });

  describe("Check for super Admin privilege", () => {
    it("adds an Admin (only super admins token) ", async () => {
      const response = await request
        .post("/admins/")
        .send(dummyAdmin)
        .set("Authorization", "bearer " + token);
      expect(response.status).toBe(200);
      expect(response.body.name).toEqual("A");
    });

    it("reject to add an Admin if name already exist ", async () => {
      const response = await request
        .post("/admins/")
        .send(dummyAdmin)
        .set("Authorization", "bearer " + token);
      expect(response.status).toBe(400);
    });

    it("adds an Admin rejected  --not super admins token ", async () => {
      const response = await request.post("/admins/").send(dummyAdmin);
      expect(response.status).toBe(401);
    });

    it("should get back an array of admins with super admin token provided", async () => {
      const response = await request
        .get("/admins/")
        .set("Authorization", "bearer " + token);
      expect(response.status).toBe(200);
    });

    it("should reject to get back an array of admins  --not super admins token", async () => {
      const response = await request.get("/admins/");
      expect(response.status).toBe(401);
    });
  });

  it("should get back dummy Admin", async () => {
    const response = await request.get("/admins/3");
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("A");
  });

  it("login and send back token", async () => {
    const response = await request
      .post("/admins/auth")
      .send({ name: "A", password: "123" });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
    adminToken = response.body;
  });
  it("update admin request without token rejected", async () => {
    const response = await request.put("/admins/3").send({ name: "c" });
    expect(response.status).toBe(401);
    expect(response).toThrowError;
  });
  it("update admin request with token accepted", async () => {
    const response = await request
      .put("/admins/3")
      .send({ name: "c" })
      .set("Authorization", "bearer " + adminToken);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("c");
  });
  it("delete admin request", async () => {
    const response = await request
      .delete("/admins/3")
      .set("Authorization", "bearer " + token);
    expect(response.status).toBe(200);
  });
});
