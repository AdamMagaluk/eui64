var assert = require('assert');
var eui64 = require('../eui64');

var goodMacString = '11:22:33:44:55:66:77:88';

describe('EUI 64',function(){

  describe('sanity checks',function(){
    
    it('require eui64 should return function',function(){
      assert.equal(typeof require('../eui64'),'function')
    })

    it('should always return object',function(){
      var m1 = eui64(goodMacString);
      console.log(typeof m1,'object')
    })

  
    it('should implement toString',function(){
      var m1 = eui64(goodMacString);
      assert.equal(typeof m1.toString,'function')
    })

    it('should implement toBuffer',function(){
      var m1 = eui64(goodMacString);
      assert.equal(typeof m1.toBuffer,'function')
    })

    it('should expose oui',function(){
      var m1 = eui64(goodMacString);
      assert.equal(typeof m1.oui,'number')
    })

  })

})