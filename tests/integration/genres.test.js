const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../api");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      // Genre.insertMany
      Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" }
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(g => g.name === "genre1"));
      expect(res.body.some(g => g.name === "genre2"));
      expect(res.body.some(g => g.name === "genre3"));
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let name;
    let token;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "genre 1";
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the genre if valid data is passed", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre 1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if valid data is passed", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", "genre 1");
      expect(res.body).toHaveProperty("_id");
    });
  });
});
