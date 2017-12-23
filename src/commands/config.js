var utilities = require('../utilities/torUtilities.js');
var options = require('../utilities/options.js');
var camelcase = require('camelcase');

exports.command = 'config <action>'
exports.describe = 'override default options'
exports.builder = Object.assign({
  'action': {
    'description': 'action to take',
    'choices': ['list', 'set', 'update']
  }
}, options.withoutDefaults);

exports.handler = async function (argv) {
  var config = await utilities.getConfig(argv);

  if(argv.action == 'list') {
    delete config.instances;
    console.log(config);
    return;   // Return, because no changes should take effect.
  }

  if(argv.action == 'set') {
    // Essentially means "reset".  So propogate "instances" but clear all other settings.
    config = { instances: config.instances };
  }

  for(var key in options.withoutDefaults) {
    if(typeof(argv[camelcase(key)]) !== 'undefined')
      config[key] = argv[key];
  }
  await utilities.saveConfig(argv, config);
  console.log("Default configuration updated.");
}