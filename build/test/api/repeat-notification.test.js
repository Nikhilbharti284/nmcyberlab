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
const setup_1 = require("./helpers/setup");
let app;
(0, node_test_1.before)(async () => {
    const result = await (0, setup_1.createTestApp)();
    app = result.app;
}, { timeout: 60000 });
void (0, node_test_1.describe)('/rest/repeat-notification', () => {
    void (0, node_test_1.it)('GET triggers repeating notification without passing a challenge', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/rest/repeat-notification');
        strict_1.default.equal(res.status, 200);
    });
    void (0, node_test_1.it)('GET triggers repeating notification passing an unsolved challenge', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/rest/repeat-notification?challenge=Retrieve%20Blueprint');
        strict_1.default.equal(res.status, 200);
    });
    void (0, node_test_1.it)('GET triggers repeating notification passing a solved challenge', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/rest/repeat-notification?challenge=Error%20Handling');
        strict_1.default.equal(res.status, 200);
    });
});
//# sourceMappingURL=repeat-notification.test.js.map