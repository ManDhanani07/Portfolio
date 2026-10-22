const request = require("supertest");
const app = require("../server");

describe("Practical 12: CI/CD Automated Test Suite", () => {
  // Test 1: Root Health Check Endpoint
  test("GET / returns 200 OK and API status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("endpoints");
  });

  // Test 2: In-Memory Cache Stats Endpoint (Practical 9 Verification)
  test("GET /api/tasks/cache/stats returns 200 and cache statistics", async () => {
    const res = await request(app).get("/api/tasks/cache/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toHaveProperty("hits");
    expect(res.body.stats).toHaveProperty("misses");
  });

  // Test 3: Protected Route Authentication Guard (Practical 7 Verification)
  test("GET /api/tasks returns 401 Unauthorized when no JWT token is provided", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // Test 4: 404 Route Not Found Handler
  test("GET /api/nonexistent-route returns 404 Not Found", async () => {
    const res = await request(app).get("/api/nonexistent-route");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // =========================================================================
  // Practical 13: AI API Integration Tests
  // =========================================================================
  test("POST /api/ai/generate-description returns 400 when title is missing", async () => {
    const res = await request(app).post("/api/ai/generate-description").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/ai/generate-description returns 200 with generated description & disclaimer", async () => {
    const res = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Build JWT authentication middleware with bcrypt" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.description).toBe("string");
    expect(res.body.description.length).toBeGreaterThan(10);
    expect(res.body).toHaveProperty("priority");
    expect(res.body).toHaveProperty("disclaimer");
  });

  test("GET /api/ai/status returns 200 and AI feature configuration status", async () => {
    const res = await request(app).get("/api/ai/status");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("activeProvider");
  });
});
