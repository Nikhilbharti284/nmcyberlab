"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const node_net_1 = __importDefault(require("node:net"));
const sinon_1 = __importDefault(require("sinon"));
const semver_1 = __importDefault(require("semver"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const package_json_1 = require("./../../package.json");
const validatePreconditions_1 = require("../../lib/startup/validatePreconditions");
const expect = chai_1.default.expect;
chai_1.default.use(sinon_chai_1.default);
describe('preconditionValidation', () => {
    describe('checkIfRunningOnSupportedNodeVersion', () => {
        it('should define the supported semver range as 22 - 25', () => {
            expect(package_json_1.engines.node).to.equal('22 - 25');
            expect(semver_1.default.validRange(package_json_1.engines.node)).to.not.equal(null);
        });
        it('should accept a supported version', () => {
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('25.8.1')).to.equal(true);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('24.2.0')).to.equal(true);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('23.11.1')).to.equal(true);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('22.16.0')).to.equal(true);
        });
        it('should fail for an unsupported version', () => {
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('26.0.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('21.7.3')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('20.19.2')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('19.9.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('18.20.4')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('17.3.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('16.10.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('15.9.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('14.0.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('13.13.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('12.16.2')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('11.14.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('10.20.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('9.11.2')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('8.12.0')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('7.10.1')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('6.14.4')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('4.9.1')).to.equal(false);
            expect((0, validatePreconditions_1.checkIfRunningOnSupportedNodeVersion)('0.12.8')).to.equal(false);
        });
    });
    describe('checkIfPortIsAvailable', () => {
        it('should resolve when port 3000 is closed', async () => {
            const success = await (0, validatePreconditions_1.checkIfPortIsAvailable)(3000);
            expect(success).to.equal(true);
        });
        describe('open a server before running the test', () => {
            const testServer = node_net_1.default.createServer();
            before((done) => {
                testServer.listen(3000, done);
            });
            it('should reject when port 3000 is open', async () => {
                const success = await (0, validatePreconditions_1.checkIfPortIsAvailable)(3000);
                expect(success).to.equal(false);
            });
            after((done) => {
                testServer.close(done);
            });
        });
    });
    describe('checkIfEnvironmentVariableExists', () => {
        const originalEnv = process.env.ALCHEMY_API_KEY;
        after(() => {
            process.env.ALCHEMY_API_KEY = originalEnv;
        });
        it('should return true if environment variable is present', () => {
            process.env.ALCHEMY_API_KEY = 'test-key';
            expect((0, validatePreconditions_1.checkIfEnvironmentVariableExists)('ALCHEMY_API_KEY')).to.equal(true);
        });
        it('should return false if environment variable is not present', () => {
            delete process.env.ALCHEMY_API_KEY;
            expect((0, validatePreconditions_1.checkIfEnvironmentVariableExists)('ALCHEMY_API_KEY')).to.equal(false);
        });
        it('should return false if a non-existing environment variable is checked', () => {
            expect((0, validatePreconditions_1.checkIfEnvironmentVariableExists)('NON_EXISTING_VAR')).to.equal(false);
        });
    });
    describe('isOllamaUrl', () => {
        it('should detect URL with Ollama default port 11434', () => {
            expect((0, validatePreconditions_1.isOllamaUrl)('http://localhost:11434/v1')).to.equal(true);
            expect((0, validatePreconditions_1.isOllamaUrl)('http://127.0.0.1:11434/v1')).to.equal(true);
            expect((0, validatePreconditions_1.isOllamaUrl)('https://myserver.example.com:11434/v1')).to.equal(true);
        });
        it('should detect URL with ollama hostname', () => {
            expect((0, validatePreconditions_1.isOllamaUrl)('http://ollama:11434/v1')).to.equal(true);
            expect((0, validatePreconditions_1.isOllamaUrl)('http://ollama/v1')).to.equal(true);
        });
        it('should detect URL with /ollama path prefix', () => {
            expect((0, validatePreconditions_1.isOllamaUrl)('http://myserver.example.com/ollama/v1')).to.equal(true);
        });
        it('should not flag non-Ollama URLs', () => {
            expect((0, validatePreconditions_1.isOllamaUrl)('http://localhost:8080/v1')).to.equal(false);
            expect((0, validatePreconditions_1.isOllamaUrl)('https://api.openai.com/v1')).to.equal(false);
        });
        it('should handle invalid URLs gracefully', () => {
            expect((0, validatePreconditions_1.isOllamaUrl)('not-a-url')).to.equal(false);
            expect((0, validatePreconditions_1.isOllamaUrl)('')).to.equal(false);
        });
    });
    describe('checkIfOllamaModelAvailable', () => {
        let fetchStub;
        beforeEach(() => {
            fetchStub = sinon_1.default.stub(global, 'fetch');
        });
        afterEach(() => {
            fetchStub.restore();
        });
        it('should succeed when model is listed in Ollama response', async () => {
            fetchStub.resolves({
                ok: true,
                json: async () => ({ data: [{ id: 'qwen3.5:9b' }, { id: 'llama3:8b' }] })
            });
            await (0, validatePreconditions_1.checkIfLlmModelAvailable)('http://localhost:11434/v1');
            expect(fetchStub.calledOnce).to.equal(true);
        });
        it('should warn when configured model tag does not match pulled model tag', async () => {
            fetchStub.resolves({
                ok: true,
                json: async () => ({ data: [{ id: 'qwen3.5:9b-q4' }] })
            });
            await (0, validatePreconditions_1.checkIfLlmModelAvailable)('http://localhost:11434/v1');
            expect(fetchStub.calledOnce).to.equal(true);
        });
        it('should warn when model is not in the available list', async () => {
            fetchStub.resolves({
                ok: true,
                json: async () => ({ data: [{ id: 'llama3:8b' }, { id: 'mistral:7b' }] })
            });
            await (0, validatePreconditions_1.checkIfLlmModelAvailable)('http://localhost:11434/v1');
            expect(fetchStub.calledOnce).to.equal(true);
        });
        it('should handle empty model list', async () => {
            fetchStub.resolves({
                ok: true,
                json: async () => ({ data: [] })
            });
            await (0, validatePreconditions_1.checkIfLlmModelAvailable)('http://localhost:11434/v1');
            expect(fetchStub.calledOnce).to.equal(true);
        });
        it('should handle non-ok response gracefully', async () => {
            fetchStub.resolves({ ok: false, status: 500 });
            await (0, validatePreconditions_1.checkIfLlmModelAvailable)('http://localhost:11434/v1');
            expect(fetchStub.calledOnce).to.equal(true);
        });
        it('should handle fetch error gracefully', async () => {
            fetchStub.rejects(new Error('Connection refused'));
            await (0, validatePreconditions_1.checkIfLlmModelAvailable)('http://localhost:11434/v1');
            expect(fetchStub.calledOnce).to.equal(true);
        });
    });
    describe('checkIfDomainReachable', () => {
        let fetchStub;
        beforeEach(() => {
            fetchStub = sinon_1.default.stub(global, 'fetch');
        });
        afterEach(() => {
            fetchStub.restore();
        });
        it('should return true if domain is reachable', async () => {
            fetchStub.resolves({ ok: true });
            const success = await (0, validatePreconditions_1.checkIfDomainReachable)('https://www.alchemy.com/');
            expect(success).to.equal(true);
            expect(fetchStub.calledOnce).to.equal(true);
        });
        it('should return false and log warnings if domain is not reachable', async () => {
            fetchStub.rejects(new Error('Network error'));
            const success = await (0, validatePreconditions_1.checkIfDomainReachable)('https://www.alchemy.com/');
            expect(success).to.equal(false);
            expect(fetchStub.calledOnce).to.equal(true);
        });
    });
});
//# sourceMappingURL=preconditionValidationSpec.js.map