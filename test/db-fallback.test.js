const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../config/db');

test('reports that database is unavailable on Vercel without DB config', () => {
  const previousVercel = process.env.VERCEL;
  const previousHost = process.env.DB_HOST;
  const previousUser = process.env.DB_USER;
  const previousName = process.env.DB_NAME;

  process.env.VERCEL = '1';
  delete process.env.DB_HOST;
  delete process.env.DB_USER;
  delete process.env.DB_NAME;

  try {
    assert.equal(db.canUseDatabase(), false);
  } finally {
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;

    if (previousHost === undefined) delete process.env.DB_HOST;
    else process.env.DB_HOST = previousHost;

    if (previousUser === undefined) delete process.env.DB_USER;
    else process.env.DB_USER = previousUser;

    if (previousName === undefined) delete process.env.DB_NAME;
    else process.env.DB_NAME = previousName;
  }
});
