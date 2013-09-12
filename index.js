var Int64 = require('node-int64');

function EUI64(val){
  this._num = new Int64(val);
};