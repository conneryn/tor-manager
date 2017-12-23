const utilities = require('../utilities/torUtilities.js');
const fs = require('fs');
const path = require('path');

exports.command = 'remove <name>'
exports.describe = 'remove instance'
exports.builder = {
  'name': {
    description: 'instance name'
  }
}

exports.handler = async function (argv) {
  var config = await utilities.getConfig(argv);

  if(!config.instances[argv.name]) {
    console.log("Instance '" + argv.name + "' not found.");
    return;
  }

  delete config.instances[argv.name];
  await utilities.saveConfig(argv, config);

  console.log("Removed '" + argv.name + "'.");
}