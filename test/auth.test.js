const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const mongoose = require("mongoose");

//Test User
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

//After all tests are done, close the db connection
afterAll(async () => {
  //Delete created user
  await User.findOneAndDelete({ email: testUser.email });
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register a user with the same email", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual("User already exists");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with incorrect password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual("Invalid credentials");
  });
});
