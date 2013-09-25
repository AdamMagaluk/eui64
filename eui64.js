var extend = require('extend')
var debug  = require('debug')('eui64');

var LENGTH = 8;
var SEPERATORS = [':','-'];

function genHex(ar){
  for(var i=0;i<LENGTH;i++){
    
    ar[i] = '0x' + ar[i];

    if(isNaN(parseInt(ar[i])))
      throw new Error('parse error non hex value');
  }
  return ar;
}


module.exports = parse;

function parse(arg,opt){
  try{
    return new Eui64(arg,opt);
  }catch(err){
    debug(err)
    return null;    
  }
}

function Eui64(arg,opt) {
  if(!(this instanceof Eui64))
    return new Eui64(arg,opt);

  this.options = {
    oui : 36,
    seperator : ':'
  }

  extend(this.options,opt);

  this._val = null;

  this._parse(arg);

  this.__defineGetter__("oui",this._getOUI.bind(this));
}

Eui64.prototype._getOUI = function() {return 1;}

Eui64.prototype.toString = function() {
  var r = '';
  for(var i=0;i<LENGTH;i++){
    r+=this._val[i].toString(16);
    if(i !== LENGTH-1)
      r+=this.options.seperator;
  }
  return r;
};

Eui64.prototype.toBuffer = function() {
  return this._val;
};

Eui64.prototype._parse = function(arg) {
  if(!arg)
    return null;

  if(typeof arg === 'string')
    return this._parseString(arg);
  else if(arg instanceof Buffer)
    return this._parseBuffer(arg);

  throw new Error('input not buffer or string');
};

Eui64.prototype._parseBuffer = function(buf){
  if(buf.length !== LENGTH)
    throw new Error('buffer expected length ' + LENGTH)

  this._val = new Buffer(LENGTH)
  buf.copy(this._val);
}

Eui64.prototype._parseString = function(arg) {
  for(var i=0;i<SEPERATORS.length;i++){
    var s = SEPERATORS[i];
    var idx = arg.indexOf(s);
    if(idx > 0){

      var ar = arg.split(s);
      if(ar.length !== LENGTH)
        return null;

      this._val = new Buffer(genHex(ar),'hex');
      return;
    }
  }

  if(arg[0] === '0' && (arg[1] === 'x' || arg[1] === 'X') && arg.length === LENGTH*2+2){
    var ar = arg.substr(2,LENGTH*2).match(/.{1,2}/g);
    this._val = new Buffer(genHex(ar),'hex');
    return;
  }

  if(arg.length === LENGTH*2){
    var ar = arg.match(/.{1,2}/g);
    this._val = new Buffer(genHex(ar),'hex');
    return;
  }

  throw new Error('string parse error')
};