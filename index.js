#!/usr/bin/env node

function usage () {/*

Usage

  bonjour-publish --host=127.0.0.1 --port=8088 --type=some "title of the server"

Options

  --host | -H       Host which your server listens
  --port | -P       Port which your server listens
  --type | -T       Type of interface provided by your server
  --multicast | -M  Use udp multicasting
  --interface | -I  Explicitly specify a network interface. Defaults to all.
  --udpport | -U    Set the udp port
  --ip              Set the udp IP
  --ttl | -T        Set the multicast TTL
  --loopback | -L   Receive your own packets
  --reuseAddr | -R  Type of interface provided by your server
  --verbose | -v    Set the reuseAddr on the socket (node >=0.11.13)

Examples
  bonjour-publish -H 127.0.0.1 -P 8088 -T rc
  bonjour-publish -H 127.0.0.1 -P 8088 -T http

*/}
var pkg   = require('./package.json')
var argv  = require('minimist')(process.argv.slice(2));
var help  = require('@maboiteaspam/show-help')(usage, argv.h||argv.help, pkg)
var debug = require('@maboiteaspam/set-verbosity')(pkg.name, argv.v || argv.verbose);

// bonjour options
const host      = argv.host || argv.H || false;
const port      = argv.port || argv.P || false;
const type      = argv.type || argv.T || false;
const title     = argv['_'].length && argv['_'][0] || "nop, no title set";

// mdns options
const mcast     = argv.multicast || argv.M || null;
const iface     = argv.interface || argv.I || null;
const uPort     = argv.udpport || null;
const uIP       = argv.udpip || null;
const TTL       = argv.ttl || argv.T || null;
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

var bonjour = require('bonjour')(mdnsOpts);

// advertise your server
var opts = { name: title, type: type, port: port, host: host };
if (host) opts.host = host;
bonjour.publish(opts)

var tearDown = function (then) {
  bonjour.destroy();
}
process.on('beforeExit', tearDown)
process.on('SIGINT', tearDown)
