const path = require('path');
const osUtilities = require('./osUtilities.js');

var options = {
    'family-prefix': {
      describe: 'name prefix for all your tor instances',
      default: ''
    },
    'template': {
      describe: 'template for torrc file (Mustache)',
      default: path.join(__dirname, '..', 'templates', 'torrc.template'),
      coerce: path.resolve
    },
    'contactInfo': {
      describe: 'admin contact details',
      default: 'Random Person <nobody AT example dot com>'
    },
    'data-dir': {
      describe: 'tor config directory',
      default: osUtilities.DEFAULT_DATA_DIR,
      coerce: path.resolve
    },
    'tor-dir': {
      describe: 'tor config directory',
      default: osUtilities.DEFAULT_TOR_DIR,
      coerce: path.resolve
    },
    'include-tor-null': {
      describe: 'include tor-null block list',
      default: false
    },
    'tor-null-url': {
      describe: 'TorNull url',
      default: 'https://tornull.org/tornull-bl.txt'
    },
    'dir-frontpage': {
      describe: 'default directory frontpage',
      default: path.join(osUtilities.DEFAULT_TOR_DIR, 'tor-exit-notice.html'),
      coerce: path.resolve
    },
    'ip': {
      description: 'ip to bind to',
      default: '0.0.0.0'
    },
    'exit-policy': {
      describe: 'default exit policy',
      choices: ['none', 'strict','reduced','all'],
      default: 'none'
    },
    'dir-port': {
      describe: 'default DirPort to listen on',
      default: 80
    },
    'or-port': {
      describe: 'default OrPort to listen on',
      default: 443
    }
  }

// Now lets clone and strip all "defaults"
var optionsWithoutDefaults = JSON.parse(JSON.stringify(options))
for(let key in optionsWithoutDefaults) {
  if(typeof(optionsWithoutDefaults[key].default) !== 'undefined')
    delete optionsWithoutDefaults[key].default;
}

module.exports = {
  withDefaults: options,
  withoutDefaults: optionsWithoutDefaults
}