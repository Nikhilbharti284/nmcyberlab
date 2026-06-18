"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const expect = chai_1.default.expect;
describe('antiCheat', () => {
    let antiCheat;
    beforeEach(() => {
        delete require.cache[require.resolve('../../lib/antiCheat')];
        antiCheat = require('../../lib/antiCheat');
        antiCheat.reset();
    });
    describe('calculateCheatScore', () => {
        it('should return cheat score of 0 if challenge is tightly coupled to the previously solved one', () => {
            const challenge1 = { key: 'loginAdminChallenge', difficulty: 1 };
            const challenge2 = { key: 'weakPasswordChallenge', difficulty: 1 };
            antiCheat.calculateCheatScore(challenge1);
            const score = antiCheat.calculateCheatScore(challenge2);
            expect(score).to.equal(0);
        });
        it('should return cheat score of 0 if challenge is loosely coupled to the previously solved one', () => {
            const challenge1 = { key: 'localXssChallenge', difficulty: 1 };
            const challenge2 = { key: 'xssBonusChallenge', difficulty: 1 };
            antiCheat.calculateCheatScore(challenge1);
            const score = antiCheat.calculateCheatScore(challenge2);
            expect(score).to.equal(0);
        });
        it('should return cheat score of 0 if challenge is loosely coupled to one in the past', () => {
            const challenge1 = { key: 'localXssChallenge', difficulty: 1 };
            const challenge2 = { key: 'missingEncodingChallenge', difficulty: 1 };
            const challenge3 = { key: 'forgottenBackupChallenge', difficulty: 1 };
            const challenge4 = { key: 'xssBonusChallenge', difficulty: 1 };
            antiCheat.calculateCheatScore(challenge1);
            antiCheat.calculateCheatScore(challenge2);
            antiCheat.calculateCheatScore(challenge3);
            const score = antiCheat.calculateCheatScore(challenge4);
            expect(score).to.equal(0);
        });
        it('should assume cheating if two unrelated challenges are solved after each other', () => {
            const challenge1 = { key: 'localXssChallenge', difficulty: 1 };
            const challenge2 = { key: 'missingEncodingChallenge', difficulty: 1 };
            antiCheat.calculateCheatScore(challenge1);
            const score = antiCheat.calculateCheatScore(challenge2);
            expect(score).to.be.greaterThan(0);
        });
    });
});
//# sourceMappingURL=antiCheatSpec.js.map