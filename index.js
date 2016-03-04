#!/usr/bin/env node

function usage () {/*

Usage

  bonjour-publish --host=127.0.0.1 --port=8088 --type=some "title of the server"

Options

  --host | -H     Host which your server listens
  --port | -P     Port which your server listens
  --type | -T     Type of interface provided by your server
  --verbose | -v  Enable verbosity pass in the module list to debug.

Examples
  bonjour-publish -H 127.0.0.1 -P 8088 -T rc
  bonjour-publish -H 127.0.0.1 -P 8088 -T http
*/}
var pkg   = require('./package.json')
var argv  = require('minimist')(process.argv.slice(2));
var help  = require('@maboiteaspam/show-help')(usage, argv.h||argv.help, pkg)
var debug = require('@maboiteaspam/set-verbosity')(pkg.name, argv.v || argv.verbose);

const host = argv.host || argv.H || false;
const port = argv.port || argv.P || false;
const type = argv.type || argv.T || false;
const title = argv['_'].length && argv['_'][0] || "nop, no title set";

(!port && !type) && help.print(usage, pkg) && help.die(
  "Wrong invokation"
);

console.log("Announce '%s' on %s:%s as %s", title, host, port, type)

var bonjour = require('bonjour')()

// advertise your server
var opts = { name: title, type: type, port: port, host: host };
if (host) opts.host = host;
bonjour.publish(opts)

var tearDown = function (then) {
  bonjour.destroy();
}
process.on('beforeExit', tearDown)
process.on('SIGINT', tearDown)
