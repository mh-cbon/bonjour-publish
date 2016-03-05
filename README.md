# bonjour-publish
Publish a service on bonjour

# Install

```
git clone https://github.com/mh-cbon/bonjour-publish.git
cd bonjour-publish
npm link . --local
bonjour-publish -H 127.0.0.1 -P 8088 -T rc "Title of the server"
...
ctrl+c to quit
```

# Command line

    bonjour-publish 1.0.0
    Publish a service on bonjour

    Usage

      bonjour-publish --host=127.0.0.1 --port=8088 --type=some  "Title of the server"

    Options

      --host | -H       Host which your server listens (127.0.0.1)
      --port | -P       Port which your server listens (8090)
      --type | -T       Type of interface provided by your server (http|smtp..)

      --multicast | -M  Use UDP multicasting
      --interface | -I  Explicitly specify a network interface. Defaults to all. (192.168.0.2)
      --udpport         Set the UDP port (5353)
      --udpip           Set the UDP IP (224.0.0.251)
      --ttl | -T        Set the multicast TTL (255)
      --loopback | -L   Receive your own packets
      --reuseAddr | -R  Set the reuseAddr on the socket (node >=0.11.13)
      --verbose | -v    Set verbosity. Defaults to * Pass in modules name to debug.

    Examples
      bonjour-publish -H 127.0.0.1 -P 8088 -T rc "hello!"
      bonjour-publish -H 127.0.0.1 -P 8088 -T http "I love you,"
      bonjour-publish -L -H 127.0.0.1 -P 8088 -T http "Could you give me your name ?"
      bonjour-publish -L -R -P 8088 -T http "doors"
      bonjour-publish -L -R -M -I 192.168.0.2 -P 8088 -T http "doors"

# read more

- https://github.com/watson/bonjour
- https://github.com/mafintosh/multicast-dns
- https://github.com/watson/bonjour-browser
