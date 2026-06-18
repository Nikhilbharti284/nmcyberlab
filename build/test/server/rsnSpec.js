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
const sinon_1 = __importDefault(require("sinon"));
const node_fs_1 = __importDefault(require("node:fs"));
const rsnUtil_1 = require("../../rsn/rsnUtil");
const expect = chai_1.default.expect;
describe('rsnUtil', () => {
    describe('filterString', () => {
        it('should remove carriage return characters', () => {
            expect((0, rsnUtil_1.filterString)('line1\r\nline2\r\n')).to.equal('line1\nline2\n');
        });
        it('should leave unix line endings intact', () => {
            expect((0, rsnUtil_1.filterString)('line1\nline2\n')).to.equal('line1\nline2\n');
        });
        it('should handle empty string', () => {
            expect((0, rsnUtil_1.filterString)('')).to.equal('');
        });
        it('should handle string with only carriage returns', () => {
            expect((0, rsnUtil_1.filterString)('\r\r\r')).to.equal('');
        });
    });
    describe('findChangedFiles', () => {
        it('should return empty array when no changes', () => {
            const current = {
                'challenge_1.ts': { added: [5, 10], removed: [3] }
            };
            const cached = {
                'challenge_1.ts': { added: [5, 10], removed: [3] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal([]);
        });
        it('should detect changed added lines', () => {
            const current = {
                'challenge_1.ts': { added: [5, 11], removed: [] }
            };
            const cached = {
                'challenge_1.ts': { added: [5, 10], removed: [] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal(['challenge_1.ts']);
        });
        it('should detect changed removed lines', () => {
            const current = {
                'challenge_1.ts': { added: [], removed: [7] }
            };
            const cached = {
                'challenge_1.ts': { added: [], removed: [8] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal(['challenge_1.ts']);
        });
        it('should detect new files not in cache', () => {
            const current = {
                'newChallenge_1.ts': { added: [], removed: [] }
            };
            const cached = {};
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal(['newChallenge_1.ts']);
        });
        it('should detect length changes in added lines', () => {
            const current = {
                'challenge_1.ts': { added: [5, 10, 15], removed: [] }
            };
            const cached = {
                'challenge_1.ts': { added: [5, 10], removed: [] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal(['challenge_1.ts']);
        });
        it('should detect length changes in removed lines', () => {
            const current = {
                'challenge_1.ts': { added: [], removed: [3, 7] }
            };
            const cached = {
                'challenge_1.ts': { added: [], removed: [3] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal(['challenge_1.ts']);
        });
        it('should return multiple changed files', () => {
            const current = {
                'a_1.ts': { added: [1], removed: [] },
                'b_1.ts': { added: [], removed: [2] },
                'c_1.ts': { added: [], removed: [] }
            };
            const cached = {
                'a_1.ts': { added: [], removed: [] },
                'b_1.ts': { added: [], removed: [] },
                'c_1.ts': { added: [], removed: [] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal(['a_1.ts', 'b_1.ts']);
        });
        it('should compare correctly regardless of array order', () => {
            const current = {
                'challenge_1.ts': { added: [10, 5], removed: [7, 3] }
            };
            const cached = {
                'challenge_1.ts': { added: [5, 10], removed: [3, 7] }
            };
            expect((0, rsnUtil_1.findChangedFiles)(current, cached)).to.deep.equal([]);
        });
    });
    describe('getFixExplanation', () => {
        const info = {
            fixes: [
                { id: 1, explanation: 'First fix explanation' },
                { id: 2, explanation: 'Second fix explanation' },
                { id: 3, explanation: 'Third fix explanation' }
            ],
            hints: ['hint1']
        };
        it('should return explanation for standard filename', () => {
            expect((0, rsnUtil_1.getFixExplanation)('challengeName_2.ts', info)).to.equal('Second fix explanation');
        });
        it('should return explanation for correct fix filename', () => {
            expect((0, rsnUtil_1.getFixExplanation)('challengeName_1_correct.ts', info)).to.equal('First fix explanation');
        });
        it('should return null when fix id not found in info', () => {
            expect((0, rsnUtil_1.getFixExplanation)('challengeName_99.ts', info)).to.equal(null);
        });
        it('should return null when info is null', () => {
            expect((0, rsnUtil_1.getFixExplanation)('challengeName_1.ts', null)).to.equal(null);
        });
        it('should return null when filename has no id pattern', () => {
            expect((0, rsnUtil_1.getFixExplanation)('noIdHere.ts', info)).to.equal(null);
        });
    });
    describe('loadChallengeInfo', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('should return null when info file does not exist', () => {
            sinon_1.default.stub(node_fs_1.default, 'existsSync').returns(false);
            expect((0, rsnUtil_1.loadChallengeInfo)('nonExistentChallenge')).to.equal(null);
        });
        it('should parse and return challenge info from yml file', () => {
            sinon_1.default.stub(node_fs_1.default, 'existsSync').returns(true);
            sinon_1.default.stub(node_fs_1.default, 'readFileSync').returns('fixes:\n' +
                '  - id: 1\n' +
                '    explanation: "Test explanation"\n' +
                'hints:\n' +
                '  - "Test hint"\n');
            const result = (0, rsnUtil_1.loadChallengeInfo)('testChallenge');
            expect(result).to.deep.equal({
                fixes: [{ id: 1, explanation: 'Test explanation' }],
                hints: ['Test hint']
            });
        });
    });
});
//# sourceMappingURL=rsnSpec.js.map