const os = require('os');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const constants = require('./constants.js');

switch(os.platform()) {
case 'linux':
  module.exports = {
    DEFAULT_CONFIG_DB: '~/.tor-manager.db',
    DEFAULT_TOR_DIR: '/etc/tor',
    DEFAULT_DATA_DIR: '/var/lib/tor',
    executionCommand: async function(action, name, configs) {
      await exec('systemctl ' + action + ' tor@' + name + '.service')
    }
  }
break;

// TODO add support for more OS types?

case 'win32':
  module.exports = {
    DEFAULT_CONFIG_DB: path.join(os.homedir(), 'Tor', '.tor-manager.db'),
    DEFAULT_TOR_DIR: 'C:\\path\\Data\\Tor',  // TODO what is default Tor directory?
    DEFAULT_DATA_DIR: path.join(os.homedir(), 'Tor', 'Data'),
    executionCommand: async function(action, name, configs) {
      switch(action) {
        case 'start':
        case 'stop':
            return await exec('tor --service ' + action + ' -f ' + path.join(configs.torDir, name + constants.TORRC_EXTENSION));
        case 'restart':
            await module.exports.executionCommand('stop', name, configs); 
            await module.exports.executionCommand('start', name, configs);
      }
    }
  }
  break;

default:     // These very likely will not work
  module.exports = {
    DEFAULT_CONFIG_DB: path.join(os.homedir(), 'tor', '.tor-manager.db'),
    DEFAULT_TOR_DIR: '???',
    DEFAULT_DATA_DIR: path.join(os.homedir(), 'tor', 'data'),
    executionCommand: async function(action, name, configs) {
      await exec('systemctl ' + action + ' tor@' + name + '.service')
    }
  }
  break;
}