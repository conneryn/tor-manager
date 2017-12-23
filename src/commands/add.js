var utilities = require('../utilities/torUtilities.js');
const options = require('../utilities/options.js');
const camelcase = require('camelcase');

exports.command = 'add <name>'
exports.describe = 'add an instance'
exports.builder = options.withoutDefaults;

exports.handler = async function (argv) {
  const config = await utilities.getConfig(argv);

  try {
    check(argv, config);
  } catch(e) {
    console.log("Error: " + e.message);
    return;
  }

  let isUpdate = config.instances[argv.name] != null;
  var instanceConfig = {
    name: argv.name
  };
  for(var key in options.withoutDefaults) {
    if(typeof(argv[camelcase(key)]) !== 'undefined')
      instanceConfig[key] = argv[key];
  }
  config.instances[argv.name] = instanceConfig;

  await utilities.saveConfig(argv, config);

  console.log((isUpdate ? "Updated": "Added") + " instance '" + argv.name + "'");
}

const check = function(argv, config) {
  let others = Object.values(config.instances).filter(i => i.name != argv.name);

  checkConflict('IP:OrPort', argv, others, i => i.ip + ":" + i.orPort);
  checkConflict('IP:DirPort', argv, others, i => i.ip + ":" + i.dirPort);
}

const checkConflict = function(title, item, others, map) {
  var unique = map(item);
  var duplicate = others.map(map).indexOf(unique);
  if(duplicate > -1) {
    throw new Error(title + " conflicts with an existing instance '" + others[duplicate].name + "'.  Please select a different combination.");
  }
}