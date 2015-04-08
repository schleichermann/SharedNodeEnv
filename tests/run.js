/**
 * Created by Tim on 4/8/15.
 */

var path = require('path');
var should = require('chai').should();

var sharedNodeEnv = require('./../index');

describe('.env file', function () {
    it('should locate local .env-local file', function(){
        sharedNodeEnv();
        should.exist(SERVER_ID);
        //process.env.SERVER_ID.should.equal('123456');
    });
});