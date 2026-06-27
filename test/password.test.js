const test = require("node:test");
const assert = require("node:assert/strict");
const { hashPassword, verifyPassword } = require("../utils/password");

test("verifies bcrypt hashes and plain text passwords", async () => {
  const plain = "demo123";
  const hash = await hashPassword(plain);

  assert.notEqual(hash, plain);
  assert.equal(await verifyPassword(plain, hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
  assert.equal(await verifyPassword(plain, plain), true);
});
