const chai = require('chai');
const should = chai.should();

const Sut = require('../services/chatService').ChatService

describe('CalculationsService', function () {
    it('should run', async function() {
        const sut = new Sut();
        const result = await sut.createCompletion('Say this is a test');

        result.should.exist;
    });

    it('should run1', async function() {
        this.timeout('30000');
        const sut = new Sut();
        const result = await sut.getCompanyMetrics('IBM');

        result.should.exist;
    });

    it('should run2', async function() {
        this.timeout('30000');
        const sut = new Sut();
        const result = await sut.getIndustryMetrics('Technology');

        result.should.exist;
    });

    it('should run3', async function() {
        this.timeout('30000');
        const sut = new Sut();
        const result = await sut.buildRiskReport('IBM', 'Technology');

        result.should.exist;
    });
});