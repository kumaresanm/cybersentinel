const chai = require('chai');
const should = chai.should();

const Sut = require('../services/chatService').ChatService

describe('CalculationsService', function () {
    it('should run', async function() {
        const sut = new Sut();
        const result = await sut.createCompletion('Say this is a test');

        result.should.exist;
    });
});