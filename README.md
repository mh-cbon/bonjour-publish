# bonjour-publish
Publish a service on bonjour

# Install

```
git clone https://github.com/mh-cbon/bonjour-publish.git
cd bonjour-publish
npm link . -g --local
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

      --host | -H       Host which your server listens
      --port | -P       Port which your server listens
      --type | -T       Type of interface provided by your server
      --multicast | -M  Use UDP multicasting
      --interface | -I  Explicitly specify a network interface. Defaults to all.
      --udpport         Set the UDP port
      --udpip           Set the UDP IP
      --ttl | -T        Set the multicast TTL
      --loopback | -L   Receive your own packets
      --reuseAddr | -R  Type of interface provided by your server
      --verbose | -v    Set the reuseAddr on the socket (node >=0.11.13)

    Examples
      bonjour-publish -H 127.0.0.1 -P 8088 -T rc "hello!"
      bonjour-publish -H 127.0.0.1 -P 8088 -T http "I love you,"
      bonjour-publish -L -H 127.0.0.1 -P 8088 -T http "Could you give me your name ?"

# read more

- https://github.com/watson/bonjour
- https://github.com/mafintosh/multicast-dns
- https://github.com/watson/bonjour-browser
