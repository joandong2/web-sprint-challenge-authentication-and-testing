const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

// a global jest hook to run before each individual test
beforeEach(async () => {
    // re-run the seeds and start with a fresh database for each test
    await db.seed.run();
});

// a global jest hook to run after all the tests are done
afterAll(async () => {
    // closes the database connection so the jest command doesn't stall
    await db.destroy();
});

describe("users tests", () => {
    it("POST register", async () => {
        const res = await supertest(server).post("/api/auth/register").send({
            username: "jackdoe1",
            password: "abc12345",
        });
        expect(res.statusCode).toBe(201);
        expect(res.headers["content-type"]).toBe(
            "application/json; charset=utf-8"
        );
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBe("jackdoe1");
    });

    it("POST login w/ valid credentials ", async () => {
        const user = { username: "janedoe1", password: "abc12345" };

        const reg = await supertest(server)
            .post("/api/auth/register")
            .send(user);
        expect(reg.statusCode).toBe(201);

        const res = await supertest(server).post("/api/auth/login").send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Welcome janedoe1!");
        expect(res.body.token).toBeDefined();
    });

    it("POST login w/ invalid credentials ", async () => {
        const res = await supertest(server).post("/api/auth/login").send({
            username: "jackdoe1",
            password: "xyz12345",
        });
        expect(res.statusCode).toBe(401);
        expect(res.headers["content-type"]).toBe(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toBe("Invalid Credentials");
    });

    it("Access unauthorized page", async () => {
        const res = await supertest(server).post("/api/jokes");

        expect(res.statusCode).toBe(401);
        expect(res.body.you).toBe("shall not pass!");
    });
});
