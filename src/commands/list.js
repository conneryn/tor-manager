var utilities = require('../utilities/torUtilities.js');

exports.command = 'list [name]'
exports.describe = 'list configured instances'
exports.builder = {
  'name': {
    description: 'name of the instance',
    default: 'all'
  }
}

exports.handler = async function (argv) {
  const config = await utilities.getConfig(argv);

  if(argv.name == 'all') {
    console.log(config.instances);
  }else{
    if(!config.instances[argv.name]) {
      console.log("Error: Instance '" + argv.name + "' not found.");
    } else {
      console.log(config.instances[argv.name]);
    }
  }
}