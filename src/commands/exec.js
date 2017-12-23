const path = require('path');
const utilities = require('../utilities/torUtilities.js');
const osUtilities = require('../utilities/osUtilities.js');

exports.command = 'exec <action> [name]'
exports.describe = 'run systemctrl on tor instance (sudo required)'
exports.builder = {
  'name': {
    description: 'instance name',
    default: 'all'
  },
  'action': {
    description: 'action to take',
    choices: ['start', 'stop', 'restart']
  },
  'tor-dir': {
    describe: 'tor config directory',
    default: osUtilities.DEFAULT_TOR_DIR,
    coerce: path.resolve
  },
}

exports.handler = async function (argv) {
  const config = await utilities.getConfig(argv);
  if(argv.name != 'all') {
    if(!config.instances[argv.name]) {
      console.log("Invalid instance '" + argv.name + "'.");
      return;
    }
    await osUtilities.executionCommand(argv.action, argv.name, Object.assign({}, config.instances[argv.name], argv));
    return;
  }

  for(let instance in config.instances) {
    await utilities.executionCommand(argv.action, instance.name, Object.assign({}, instance, argv));
  }
}