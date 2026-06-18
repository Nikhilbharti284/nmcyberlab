"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = void 0;
const server_1 = require("../../../server");
async function createTestApp() {
    return await (0, server_1.createApp)({ inMemoryDb: true });
}
exports.createTestApp = createTestApp;
//# sourceMappingURL=setup.js.map