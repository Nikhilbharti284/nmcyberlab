"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = __importDefault(require("chai"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const appConfiguration_1 = require("../../routes/appConfiguration");
const expect = chai_1.default.expect;
chai_1.default.use(sinon_chai_1.default);
describe('appConfiguration', () => {
    let req;
    let res;
    it('should return configuration object', () => {
        req = {};
        res = { json: sinon_1.default.spy() };
        (0, appConfiguration_1.retrieveAppConfiguration)()(req, res);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(res.json).to.have.been.calledOnce;
        const returnedConfig = res.json.firstCall.args[0].config;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(returnedConfig.application).to.exist;
    });
    it('should not expose chatBot.llmApiUrl', () => {
        req = {};
        res = { json: sinon_1.default.spy() };
        (0, appConfiguration_1.retrieveAppConfiguration)()(req, res);
        const returnedConfig = res.json.firstCall.args[0].config;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(returnedConfig.application.chatBot).to.exist;
        expect(returnedConfig.application.chatBot).to.not.have.property('llmApiUrl');
    });
});
//# sourceMappingURL=appConfigurationSpec.js.map