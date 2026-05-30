import test from "node:test";
import assert from "node:assert/strict";

const API_URL = process.env.TEST_API_URL || "http://localhost:8080";

test("GET /api/incidents should return incident list", async () => {
    const response = await fetch(`${API_URL}/api/incidents`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body), true);
});