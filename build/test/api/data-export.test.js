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
const node_path_1 = __importDefault(require("node:path"));
const setup_1 = require("./helpers/setup");
const auth_1 = require("./helpers/auth");
let app;
(0, node_test_1.before)(async () => {
    const result = await (0, setup_1.createTestApp)();
    app = result.app;
}, { timeout: 60000 });
void (0, node_test_1.describe)('/rest/user/data-export', () => {
    void (0, node_test_1.it)('Export data without use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'bjoern.kimminich@gmail.com', password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI=' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ format: '1' });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, 'bkimminich');
        strict_1.default.equal(parsedData.email, 'bjoern.kimminich@gmail.com');
    });
    void (0, node_test_1.it)('Export data when CAPTCHA requested need right answer', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'bjoern.kimminich@gmail.com', password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI=' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const captchaRes = await (0, supertest_1.default)(app)
            .get('/rest/image-captcha')
            .set(authHeader);
        strict_1.default.equal(captchaRes.status, 200);
        strict_1.default.ok(captchaRes.headers['content-type']?.includes('application/json'));
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ answer: 'AAAAAA', format: 1 });
        strict_1.default.equal(res.status, 401);
        strict_1.default.ok(res.text.includes('Wrong answer to CAPTCHA. Please try again.'));
    });
    void (0, node_test_1.it)('Export data using right answer to CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'bjoern.kimminich@gmail.com', password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI=' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const captchaRes = await (0, supertest_1.default)(app)
            .get('/rest/image-captcha')
            .set(authHeader);
        strict_1.default.equal(captchaRes.status, 200);
        strict_1.default.ok(captchaRes.headers['content-type']?.includes('application/json'));
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ answer: captchaRes.body.answer, format: 1 });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, 'bkimminich');
        strict_1.default.equal(parsedData.email, 'bjoern.kimminich@gmail.com');
    });
    void (0, node_test_1.it)('Export data including orders without use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'amy@' + config_1.default.get('application.domain'), password: 'K1f.....................' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        await (0, supertest_1.default)(app)
            .post('/rest/basket/4/checkout')
            .set(authHeader);
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ format: '1' });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, '');
        strict_1.default.equal(parsedData.email, 'amy@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.orders[0].totalPrice, 9.98);
        strict_1.default.equal(parsedData.orders[0].bonus, 0);
        strict_1.default.equal(parsedData.orders[0].products[0].quantity, 2);
        strict_1.default.equal(parsedData.orders[0].products[0].name, 'Raspberry Juice (1000ml)');
        strict_1.default.equal(parsedData.orders[0].products[0].price, 4.99);
        strict_1.default.equal(parsedData.orders[0].products[0].total, 9.98);
        strict_1.default.equal(parsedData.orders[0].products[0].bonus, 0);
    });
    void (0, node_test_1.it)('Export data including reviews without use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'jim@' + config_1.default.get('application.domain'), password: 'ncc-1701' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ format: '1' });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, '');
        strict_1.default.equal(parsedData.email, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.reviews[0].message, 'Looks so much better on my uniform than the boring Starfleet symbol.');
        strict_1.default.equal(parsedData.reviews[0].author, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.reviews[0].productId, 20);
        strict_1.default.equal(parsedData.reviews[0].likesCount, 0);
        strict_1.default.equal(parsedData.reviews[0].likedBy[0], undefined);
        strict_1.default.equal(parsedData.reviews[1].message, 'Fresh out of a replicator.');
        strict_1.default.equal(parsedData.reviews[1].author, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.reviews[1].productId, 22);
        strict_1.default.equal(parsedData.reviews[1].likesCount, 0);
        strict_1.default.equal(parsedData.reviews[1].likedBy[0], undefined);
    });
    void (0, node_test_1.it)('Export data including memories without use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'jim@' + config_1.default.get('application.domain'), password: 'ncc-1701' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const file = node_path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        await (0, supertest_1.default)(app)
            .post('/rest/memories')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', file, 'Valid Image')
            .field('caption', 'Valid Image');
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ format: '1' });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, '');
        strict_1.default.equal(parsedData.email, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.memories[0].caption, 'Valid Image');
        strict_1.default.ok(parsedData.memories[0].imageUrl.includes('assets/public/images/uploads/valid-image'));
    });
    void (0, node_test_1.it)('Export data including orders with use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'amy@' + config_1.default.get('application.domain'), password: 'K1f.....................' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        await (0, supertest_1.default)(app)
            .post('/rest/basket/4/checkout')
            .set(authHeader);
        const captchaRes = await (0, supertest_1.default)(app)
            .get('/rest/image-captcha')
            .set(authHeader);
        strict_1.default.equal(captchaRes.status, 200);
        strict_1.default.ok(captchaRes.headers['content-type']?.includes('application/json'));
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ answer: captchaRes.body.answer, format: 1 });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, '');
        strict_1.default.equal(parsedData.email, 'amy@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.orders[0].totalPrice, 9.98);
        strict_1.default.equal(parsedData.orders[0].bonus, 0);
        strict_1.default.equal(parsedData.orders[0].products[0].quantity, 2);
        strict_1.default.equal(parsedData.orders[0].products[0].name, 'Raspberry Juice (1000ml)');
        strict_1.default.equal(parsedData.orders[0].products[0].price, 4.99);
        strict_1.default.equal(parsedData.orders[0].products[0].total, 9.98);
        strict_1.default.equal(parsedData.orders[0].products[0].bonus, 0);
    });
    void (0, node_test_1.it)('Export data including reviews with use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'jim@' + config_1.default.get('application.domain'), password: 'ncc-1701' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const captchaRes = await (0, supertest_1.default)(app)
            .get('/rest/image-captcha')
            .set(authHeader);
        strict_1.default.equal(captchaRes.status, 200);
        strict_1.default.ok(captchaRes.headers['content-type']?.includes('application/json'));
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ answer: captchaRes.body.answer, format: 1 });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, '');
        strict_1.default.equal(parsedData.email, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.reviews[0].message, 'Looks so much better on my uniform than the boring Starfleet symbol.');
        strict_1.default.equal(parsedData.reviews[0].author, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.reviews[0].productId, 20);
        strict_1.default.equal(parsedData.reviews[0].likesCount, 0);
        strict_1.default.equal(parsedData.reviews[0].likedBy[0], undefined);
        strict_1.default.equal(parsedData.reviews[1].message, 'Fresh out of a replicator.');
        strict_1.default.equal(parsedData.reviews[1].author, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.reviews[1].productId, 22);
        strict_1.default.equal(parsedData.reviews[1].likesCount, 0);
        strict_1.default.equal(parsedData.reviews[1].likedBy[0], undefined);
    });
    void (0, node_test_1.it)('Export data including memories with use of CAPTCHA', async () => {
        const { token } = await (0, auth_1.login)(app, { email: 'jim@' + config_1.default.get('application.domain'), password: 'ncc-1701' });
        const authHeader = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        const file = node_path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        await (0, supertest_1.default)(app)
            .post('/rest/memories')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', file, 'Valid Image')
            .field('caption', 'Valid Image');
        const captchaRes = await (0, supertest_1.default)(app)
            .get('/rest/image-captcha')
            .set(authHeader);
        strict_1.default.equal(captchaRes.status, 200);
        strict_1.default.ok(captchaRes.headers['content-type']?.includes('application/json'));
        const res = await (0, supertest_1.default)(app)
            .post('/rest/user/data-export')
            .set(authHeader)
            .send({ answer: captchaRes.body.answer, format: 1 });
        strict_1.default.equal(res.status, 200);
        strict_1.default.ok(res.headers['content-type']?.includes('application/json'));
        strict_1.default.equal(res.body.confirmation, 'Your data export will open in a new Browser window.');
        const parsedData = JSON.parse(res.body.userData);
        strict_1.default.equal(parsedData.username, '');
        strict_1.default.equal(parsedData.email, 'jim@' + config_1.default.get('application.domain'));
        strict_1.default.equal(parsedData.memories[0].caption, 'Valid Image');
        strict_1.default.ok(parsedData.memories[0].imageUrl.includes('assets/public/images/uploads/valid-image'));
    });
});
//# sourceMappingURL=data-export.test.js.map