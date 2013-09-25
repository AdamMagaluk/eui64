var eui64 = require('../eui64');

var str = "11:22:FF:44:E1:66:77:88"
var str2 = "11-22-33-44-55-66-77-88"
var str3 = "0x1122334455667788"
var str4 = "1122334455667788"

var buf = new Buffer([0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88],'hex');

var mac1 =  eui64(str)
var mac2 =  eui64(str2)
var mac3 =  eui64(str3)
var mac4 =  eui64(str4)
var mac5 =  eui64(buf)

console.log(mac1.toString())
console.log(mac2.toString())
console.log(mac3.toString())
console.log(mac4.toString())
console.log(mac5.toString())

//mac2.toString();
//mac1.toBuffer();

//mac1.oui // 0x112233