
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authController from "../controllers/authController";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

vi.mock("../models/User");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");

describe("Auth Controller - White Box (Branch Testing)", () => {

  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    vi.clearAllMocks();
  });


  it("should register a new user successfully", async () => {
    req.body = {
      name: "Arham",
      email: "test@test.com",
      password: "1234"
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed123");
    User.create.mockResolvedValue({
      _id: "1",
      name: "Arham",
      email: "test@test.com"
    });

    await authController.register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("1234", 10);
    expect(User.create).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return error if user already exists", async () => {
    req.body = {
      name: "Arham",
      email: "test@test.com",
      password: "1234"
    };

    User.findOne.mockResolvedValue({ email: "test@test.com" });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists"
    });
  });


  it("should login user and return token", async () => {
    req.body = {
      email: "test@test.com",
      password: "1234"
    };

    User.findOne.mockResolvedValue({
      _id: "1",
      email: "test@test.com",
      password: "hashed123",
      role: "user"
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token123");

    await authController.login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("1234", "hashed123");
    expect(jwt.sign).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({ token: "token123" });
  });

  it("should return error if user not found", async () => {
    req.body = {
      email: "wrong@test.com",
      password: "1234"
    };

    User.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid credentials"
    });
  });

  it("should return error if password is incorrect", async () => {
    req.body = {
      email: "test@test.com",
      password: "wrongpass"
    };

    User.findOne.mockResolvedValue({
      _id: "1",
      password: "hashed123"
    });

    bcrypt.compare.mockResolvedValue(false);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid credentials"
    });
  });

});

