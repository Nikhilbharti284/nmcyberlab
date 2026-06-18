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
void (0, node_test_1.describe)('/api', () => {
    void (0, node_test_1.it)('GET main.js contains Cryptocurrency URLs', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/main.js');
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.text.includes('/redirect?to=https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm'));
        strict_1.default.ok(res.text.includes('/redirect?to=https://explorer.dash.org/address/Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW'));
        strict_1.default.ok(res.text.includes('/redirect?to=https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6'));
    });
    void (0, node_test_1.it)('GET main.js contains password hint for support team', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/main.js');
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.text.includes('Parola echipei de asisten\\u021B\\u0103 nu respect\\u0103 politica corporativ\\u0103 pentru conturile privilegiate! V\\u0103 rug\\u0103m s\\u0103 schimba\\u021Bi parola \\xEEn consecin\\u021B\\u0103!'));
    });
});
//# sourceMappingURL=angular-dist.test.js.map