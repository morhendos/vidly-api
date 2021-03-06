const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("auth middleware", () => {
  let token = "";
  let server;

  beforeEach(() => {
    server = require("../../api");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre 1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    console.log("token 401:", token);

    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token is provided", async () => {
    token = "1234";
    console.log("token 400:", token);

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid token is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});

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

    it("should return 404 if genre of given id doesn't exist", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let name;
    let token;
    const exec = () => {
      return request(server)
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

  // describe("DELETE /:id", () => {
  //   let token;
  //   let genre;
  //   let id;

  //   const exec = async () => {
  //     return await request(server)
  //       .delete("/api/genres/" + id)
  //       .set("x-auth-token", token)
  //       .send();
  //   };

  //   beforeEach(async () => {
  //     genre = new Genre({ name: "genre1" });
  //     await genre.save();
  //     id = genre._id;
  //     token = new User({ isAdmin: true }).generateAuthToken();
  //   });

  //   it("should return the removed genre", async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty("_id", genre._id.toHexString());
  //     expect(res.body).toHaveProperty("name", genre.name);
  //   });
  // });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();
      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if genre if given id couldn't be found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return the removed genre if input is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should remove genre of given id", async () => {
      await exec();
      const genreInDb = await Genre.findById(id);
      expect(genreInDb).toBeNull();
    });
  });

  describe("PUT /:id", () => {
    let token;
    let newName;
    let genre;
    let genreId;

    const exec = () => {
      return request(server)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      genre = new Genre({ name: "Genre 1" });
      await genre.save();
      genreId = genre._id;
      newName = "Genre 2";
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if passed data is not valid", async () => {
      newName = 123;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with given id doesn't exist", async () => {
      genreId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });

    it("should update the genre if input is valid", async () => {
      const res = await exec();
      const updatedGenre = await Genre.findById(genreId);
      expect(updatedGenre.name).toBe(newName);
    });

    it("should return updated genre when update is successful", async () => {
      const res = await exec();
      expect(res.body.name).toBe("Genre 2");
    });
  });
});
