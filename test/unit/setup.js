var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');

require('angular-mocks');

chai.use(chaiAsPromised);
chai.use(sinonChai);

var sinon = require('sinon');
var sinonAsPromised = require('sinon-as-promised');

global.sinon = sinon;
global.expect = chai.expect;
global.sinonAsPromised = sinonAsPromised;
chai.should();
