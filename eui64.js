var extend = require('extend')
var debug  = require('debug')('eui64');

var LENGTH = 8;
var separatorS = [':','-'];

function genHex(ar){
  for(var i=0;i<LENGTH;i++){
    
    ar[i] = '0x' + ar[i];
    if(isNaN(parseInt(ar[i])) || ar[i].match(/(0[xX])?[a-fA-F0-9]+$/) === null)
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
    separator : ':'
  }

  extend(this.options,opt);

  this._val = null;

  this._parse(arg);
}

Eui64.prototype.oui = function() {
  if(this.options.oui === 36){
    return this._val.readUInt32BE(0);
  }else if(this.options.oui === 24){
    return (this._val[0] << 16) + (this._val[1] << 8) + this._val[2];
  }

  throw new Error('Invalid oui of ' + this.options.oui )
}

Eui64.prototype.toString = function() {
  var r = '';
  for(var i=0;i<LENGTH;i++){
    r+=this._val[i].toString(16);
    if(i !== LENGTH-1)
      r+=this.options.separator;
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
  for(var i=0;i<separatorS.length;i++){
    var s = separatorS[i];
    var idx = arg.indexOf(s);
    if(idx > 0){

      var ar = arg.split(s);
      if(ar.length !== LENGTH)
        throw new Error("Length does not match")

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