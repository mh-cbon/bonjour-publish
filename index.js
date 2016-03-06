#!/usr/bin/env node

function usage () {/*
Usage

  bonjour-publish --host=127.0.0.1 --port=8088 --type=some  "Title of the server"

Options

  Announcement (bonjour)
  --port | -P       Port which your server listens (8090)
  --type | -T       Type of interface provided by your server (http|smtp..)
  --host | -H       Host which your server listens (127.0.0.1)
  --txt             A JSON object to send as a TXT record.
  --v4 [interface]  If Host option is not provided, announce ipv4 address as host,
                    instead of your local bonjour hostname.
                    If interface (eth0, lo..) is provided,
                    only this interface will be announced.
  --v6 [interface]  If Host option is not provided, announce ipv6 address as host,
                    instead of your local bonjour hostname.
                    If interface (eth0, lo..) is provided,
                    only this interface will be announced.

  Socket setup (mdns)
  --multicast | -M  Use UDP multicasting
  --interface | -I  Explicitly specify a network interface. Defaults to all. (192.168.0.2)
  --udpport         Set the UDP port (5353)
  --udpip           Set the UDP IP (224.0.0.251)
  --ttl | -T        Set the multicast TTL (255)
  --loopback | -L   Receive your own packets
  --reuseAddr | -R  Set the reuseAddr on the socket (node >=0.11.13)
  --verbose | -v    Set verbosity. Defaults to * Pass in modules name to debug.

Examples
  bonjour-publish -H 127.0.0.1 -P 8088 -T http "hello!"
  bonjour-publish -H 127.0.0.1 -P 8088 -T http "I love you,"
  bonjour-publish -L -H 127.0.0.1 -P 8088 -T http "Could you give me your name ?"
  bonjour-publish -L -R -P 8088 -T http "doors"
  bonjour-publish -L -R -M -I 192.168.0.2 -P 8088 -T http "doors"
  bonjour-publish --txt '{"password":123}' -P 8088 -T http "doors"

Read more
  Service type must be one described at
  http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml

*/}
var pkg   = require('./package.json')
var argv  = require('minimist')(process.argv.slice(2));
var help  = require('@maboiteaspam/show-help')(usage, argv.h||argv.help, pkg)
var debug = require('@maboiteaspam/set-verbosity')(pkg.name, argv.v || argv.verbose);

// bonjour options
const host      = argv.host || argv.H || '';
const port      = argv.port || argv.P || false;
const type      = argv.type || argv.T || false;
const txt       = (argv.txt && JSON.parse(argv.txt)) || false;
const v4        = argv.v4 || false;
const v6        = argv.v6 || false;
const title     = argv['_'].length && argv['_'][0] || "nop, no title set";

// mdns options
const mcast     = argv.multicast || argv.M || false;
const iface     = argv.interface || argv.I || null;
const uPort     = (argv.udpport && parseInt(argv.udpport)) || null;
const uIP       = argv.udpip || null;
const TTL       = (argv.ttl && parseInt(argv.ttl)) || (argv.T && parseInt(argv.T)) || null;
const loopback  = argv.loopback || argv.L || null;
const reuseAddr = argv.reuseAddr || argv.R || null;

(!port && !type) && help.print(usage, pkg) && help.die(
  "Wrong invokation"
);

console.log("Announce '%s' on %s:%s as %s", title, host, port, type)

var mdnsOpts = {};
if (mcast)      mdnsOpts.multicast  = mcast;
if (iface)      mdnsOpts.interface  = iface;
if (uPort)      mdnsOpts.port       = uPort;
if (uIP)        mdnsOpts.ip         = uIP;
if (TTL)        mdnsOpts.ttl        = TTL;
if (loopback)   mdnsOpts.loopback   = loopback;
if (reuseAddr)  mdnsOpts.reuseAddr  = reuseAddr;

console.log("Options %j", mdnsOpts);

var announces = [];

if (!host && v4 || v6) {
  getHostAddresses(
    (v4 && 'IPv4' || v6 && 'IPv6'),
    v4 || v6
  ).forEach(function (addr) {
    var opts = {
      name: title,
      type: type,
      port: port ,
      host: addr.address
    };
    if (txt) opts.txt = txt;
    announces.push(opts)
  })
} else {
  var opts = { name: title, type: type, port: port };
  if (host) opts.host = host;
  if (txt)  opts.txt  = txt;
  announces.push(opts)
}

// advertise your server
console.log("announces %j", announces)
var bonjour = require('bonjour')(mdnsOpts);
announces.forEach(function (opts, i){
  bonjour.publish(opts)
})


var tearDown = function (then) {
  bonjour.destroy();
}
process.on('beforeExit', tearDown)
process.on('SIGINT', tearDown)





function getHostAddresses (type, ifaceName) {
  var onlyNonLocal = function (iface) {
    return !iface.internal;
  }
  var onlyThisType = function (iface) {
    return iface.family===type;
  }
  var onlyThisIface = function (iface) {
    return !ifaceName || iface.name===ifaceName;
  }
  return listInterfaces ().filter(onlyNonLocal).filter(onlyThisType).filter(onlyThisType)
}
function listInterfaces () {
  var os = require('os');
  var ifaces = [];
  var sysIfaces = os.networkInterfaces();
  Object.keys(sysIfaces).forEach(function (name) {
    sysIfaces[name].forEach(function (iface) {
      iface.interface = name;
      ifaces.push(iface)
    })
  })
  return ifaces;
}
