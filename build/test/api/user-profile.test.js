"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const supertest_1 = __importDefault(require("supertest"));
const config_1 = __importDefault(require("config"));
const setup_1 = require("./helpers/setup");
const auth_1 = require("./helpers/auth");
let app;
let authHeader;
(0, node_test_1.before)(async () => {
    const result = await (0, setup_1.createTestApp)();
    app = result.app;
    const { token } = await (0, auth_1.login)(app, { email: 'jim@juice-sh.op', password: 'ncc-1701' });
    authHeader = { Cookie: `token=${token}` };
}, { timeout: 60000 });
void (0, node_test_1.describe)('/profile', () => {
    void (0, node_test_1.it)('GET user profile is forbidden for unauthenticated user', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/profile');
        strict_1.default.equal(res.status, 500);
        strict_1.default.ok(res.headers['content-type']?.includes('text/html'));
        strict_1.default.ok(res.text.includes(`<h1>${config_1.default.get('application.name')} (Express`));
        strict_1.default.ok(res.text.includes('Error: Blocked illegal activity'));
    });
    void (0, node_test_1.it)('GET user profile of authenticated user', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/profile')
            .set(authHeader);
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('text/html'));
        strict_1.default.ok(res.text.includes('id="email" type="email" name="email" value="jim@juice-sh.op"'));
    });
    void (0, node_test_1.it)('POST update username of authenticated user', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/profile')
            .set('Cookie', authHeader.Cookie)
            .field('username', 'Localhorst')
            .redirects(0);
        strict_1.default.equal(res.status, 302);
    });
});
//# sourceMappingURL=user-profile.test.js.map