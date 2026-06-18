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
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const setup_1 = require("./helpers/setup");
let app;
(0, node_test_1.before)(async () => {
    const result = await (0, setup_1.createTestApp)();
    app = result.app;
}, { timeout: 60000 });
void (0, node_test_1.describe)('/metrics', () => {
    void (0, node_test_1.it)('GET metrics via public API that are available instantaneously', { skip: 'FIXME Flaky on CI/CD on at least Windows' }, async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/metrics')
            .expect(200);
        strict_1.default.ok(res.headers['content-type']?.includes('text/plain'));
        strict_1.default.match(res.text, /^.*_version_info{version="[0-9]+.[0-9]+.[0-9]+(-SNAPSHOT)?",major="[0-9]+",minor="[0-9]+",patch="[0-9]+",app=".*"} 1$/gm);
        strict_1.default.match(res.text, /^.*_challenges_solved{difficulty="[1-6]",category=".*",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_challenges_total{difficulty="[1-6]",category=".*",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_cheat_score{app=".*"} [0-9.]*$/gm);
        strict_1.default.match(res.text, /^.*_orders_placed_total{app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_users_registered{type="standard",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_users_registered{type="deluxe",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_users_registered_total{app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_wallet_balance_total{app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_user_social_interactions{type="review",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_user_social_interactions{type="feedback",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^.*_user_social_interactions{type="complaint",app=".*"} [0-9]*$/gm);
        strict_1.default.match(res.text, /^http_requests_count{status_code="[0-9]XX",app=".*"} [0-9]*$/gm);
    });
    void (0, node_test_1.it)('GET file upload metrics via public API', { skip: 'FIXME Flaky on CI/CD on at least Windows' }, async () => {
        const file = node_path_1.default.resolve(__dirname, '../files/validSizeAndTypeForClient.pdf');
        await (0, supertest_1.default)(app)
            .post('/file-upload')
            .attach('file', node_fs_1.default.readFileSync(file), 'validSizeAndTypeForClient.pdf')
            .expect(204);
        const res = await (0, supertest_1.default)(app)
            .get('/metrics')
            .expect(200);
        strict_1.default.ok(res.headers['content-type']?.includes('text/plain'));
        strict_1.default.match(res.text, /^file_uploads_count{file_type=".*",app=".*"} [0-9]*$/gm);
    });
    void (0, node_test_1.it)('GET file upload error metrics via public API', { skip: 'FIXME Flaky on CI/CD on at least Windows' }, async () => {
        const file = node_path_1.default.resolve(__dirname, '../files/invalidSizeForServer.pdf');
        await (0, supertest_1.default)(app)
            .post('/file-upload')
            .attach('file', node_fs_1.default.readFileSync(file), 'invalidSizeForServer.pdf')
            .expect(500);
        const res = await (0, supertest_1.default)(app)
            .get('/metrics')
            .expect(200);
        strict_1.default.ok(res.headers['content-type']?.includes('text/plain'));
        strict_1.default.match(res.text, /^file_upload_errors{file_type=".*",app=".*"} [0-9]*$/gm);
    });
});
//# sourceMappingURL=metrics.test.js.map