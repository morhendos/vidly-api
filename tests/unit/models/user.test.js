const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToket", () => {
  it("should return a valid JWT", () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const user = new User({ _id: userId, isAdmin: true });
    const token = user.generateAuthToken();
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decodedPayload).toMatchObject({ _id: userId, isAdmin: true });
  });
});
