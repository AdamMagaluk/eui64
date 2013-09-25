var assert = require('assert');
var bufferEqual = require('buffer-equal');
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
      assert.equal(typeof m1.oui,'function')
    })
  })


  describe('Parsing',function(){
    
    it('should return null on bugus hex val',function(){
      assert.equal(eui64('11:22:33:44:55:66:7G:88'),null);
    })

    it('should return null on invalid length',function(){
      assert.equal(eui64('11:22:33:44:55:66:77'),null);
      assert.equal(eui64('11223344556677'),null);
      assert.equal(eui64(new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77])),null);
    })

    it('should return null on invalid length',function(){
      assert.equal(eui64('11223344556677'),null);
    })

    it('should parse good string seperated by colons',function(){
      var mac = eui64('11:22:33:44:55:66:77:88');
      assert.notEqual(mac,null)
      assert(bufferEqual(mac.toBuffer(),new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88])))
      assert.equal(mac.toString(),'11:22:33:44:55:66:77:88');
      assert.equal(mac.oui(),0x11223344);
    })

    it('should parse good string seperated by dashes',function(){
      var mac = eui64('11-22-33-44-55-66-77-88')
      assert.notEqual(mac,null)
      assert(bufferEqual(mac.toBuffer(),new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88])))
      assert.equal(mac.toString(),'11:22:33:44:55:66:77:88');
    })

    it('should parse good buffer',function(){
      var mac = eui64(new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88]))
      assert.notEqual(mac,null)
      assert(bufferEqual(mac.toBuffer(),new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88])))
      assert.equal(mac.toString(),'11:22:33:44:55:66:77:88');
    })

    it('should parse good string not seperated with 0x',function(){
      var mac = eui64('0x1122334455667788')
      assert.notEqual(mac,null)
      assert(bufferEqual(mac.toBuffer(),new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88])))
      assert.equal(mac.toString(),'11:22:33:44:55:66:77:88');
    })

    it('should parse good string not seperated',function(){
      var mac = eui64('1122334455667788')
      assert.notEqual(mac,null)
      assert(bufferEqual(mac.toBuffer(),new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88])))
      assert.equal(mac.toString(),'11:22:33:44:55:66:77:88');
    })

  })

  describe('Options',function(){
    it('it should throw when oui value does not equal 32 or 24',function(){
      assert.throws(function(){
        var mac = eui64('11:22:33:44:55:66:77:88',{oui : 123});
        mac.oui();
      })
    })

    it('it return correct 24 bit oui',function(){
      var mac = eui64('11:22:33:44:55:66:77:88',{oui : 24});
      assert.equal(mac.oui(),0x112233)

    })
  })

})