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
void (0, node_test_1.describe)('/profile/image/file', () => {
    void (0, node_test_1.it)('POST profile image file valid for JPG format', async () => {
        const file = node_path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        const { token } = await (0, auth_1.login)(app, {
            email: `jim@${config_1.default.get('application.domain')}`,
            password: 'ncc-1701'
        });
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/file')
            .set('Cookie', `token=${token}`)
            .attach('file', file)
            .redirects(0);
        strict_1.default.equal(res.status, 302);
    });
    void (0, node_test_1.it)('POST profile image file invalid type', async () => {
        const file = node_path_1.default.resolve(__dirname, '../files/invalidProfileImageType.docx');
        const { token } = await (0, auth_1.login)(app, {
            email: `jim@${config_1.default.get('application.domain')}`,
            password: 'ncc-1701'
        });
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/file')
            .set('Cookie', `token=${token}`)
            .attach('file', file);
        strict_1.default.equal(res.status, 415);
        strict_1.default.ok(res.headers['content-type']?.includes('text/html'));
        strict_1.default.ok(res.text.includes(`${config_1.default.get('application.name')} (Express`));
        strict_1.default.ok(res.text.includes('Error: Profile image upload does not accept this file type'));
    });
    void (0, node_test_1.it)('POST profile image file forbidden for anonymous user', async () => {
        const file = node_path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/file')
            .attach('file', file);
        strict_1.default.equal(res.status, 500);
        strict_1.default.ok(res.headers['content-type']?.includes('text/html'));
        strict_1.default.ok(res.text.includes('Error: Blocked illegal activity'));
    });
});
void (0, node_test_1.describe)('/profile/image/url', () => {
    void (0, node_test_1.it)('POST profile image URL valid for image available online', async () => {
        const { token } = await (0, auth_1.login)(app, {
            email: `jim@${config_1.default.get('application.domain')}`,
            password: 'ncc-1701'
        });
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/url')
            .set('Cookie', `token=${token}`)
            .field('imageUrl', 'cataas.com/cat')
            .redirects(0);
        strict_1.default.equal(res.status, 302);
    });
    void (0, node_test_1.it)('POST profile image URL redirects even for invalid image URL', async () => {
        const { token } = await (0, auth_1.login)(app, {
            email: `jim@${config_1.default.get('application.domain')}`,
            password: 'ncc-1701'
        });
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/url')
            .set('Cookie', `token=${token}`)
            .field('imageUrl', 'https://notanimage.here/100/100')
            .redirects(0);
        strict_1.default.equal(res.status, 302);
    });
    void (0, node_test_1.it)('POST profile image URL forbidden for anonymous user', { skip: 'FIXME runs into "socket hang up"' }, async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/url')
            .field('imageUrl', 'cataas.com/cat');
        strict_1.default.equal(res.status, 500);
        strict_1.default.ok(res.headers['content-type']?.includes('text/html'));
        strict_1.default.ok(res.text.includes('Error: Blocked illegal activity'));
    });
    void (0, node_test_1.it)('POST valid image with tampered content length', { skip: 'Fails on CI/CD pipeline' }, async () => {
        const file = node_path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        const { token } = await (0, auth_1.login)(app, {
            email: `jim@${config_1.default.get('application.domain')}`,
            password: 'ncc-1701'
        });
        const res = await (0, supertest_1.default)(app)
            .post('/profile/image/file')
            .set('Cookie', `token=${token}`)
            .set('Content-Length', '42')
            .attach('file', file)
            .redirects(0);
        strict_1.default.equal(res.status, 500);
        strict_1.default.ok(res.text.includes('Unexpected end of form'));
    });
});
//# sourceMappingURL=profile-image-upload.test.js.map