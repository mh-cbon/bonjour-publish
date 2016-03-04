# bonjour-publish
Publish a service on bonjour

# Install

```
git clone https://github.com/mh-cbon/bonjour-publish.git
cd bonjour-publish
npm i . -g --local
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

      --host | -H     Host which your server listens
      --port | -P     Port which your server listens
      --type | -T     Type of interface provided by your server
      --verbose | -v  Enable verbosity pass in the module list to debug.

    Examples
      bonjour-publish -H 127.0.0.1 -P 8088 -T rc
      bonjour-publish -H 127.0.0.1 -P 8088 -T http

# read more

- https://github.com/watson/bonjour
- https://github.com/watson/bonjour-browser
