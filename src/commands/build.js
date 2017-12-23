const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const options = require('../utilities/options.js');
const utilities = require('../utilities/torUtilities.js');
const osUtilities = require('../utilities/osUtilities.js');
const constants = require('../utilities/constants.js');

// Disable Mustache Escape
Mustache.escape = (value) => value;

exports.command = 'build'
exports.describe = 'build configuration'
exports.builder = options.withDefaults;

exports.handler = async function (argv) {
  var config = await utilities.getConfig(argv);

  for(let instance of Object.values(config.instances)) {
    const filename = path.join(argv.torDir, instance.name + constants.TORRC_EXTENSION);
    var result = await build(Object.assign({}, instance, config, argv));

    await utilities.ensureParentDirectoryExists(filename);
    fs.writeFileSync(filename, result, 'utf8');
  }

  console.log("Updated all config files.");

  await cleanConfigs(argv.torDir, config);
}

async function cleanConfigs(dir, config) {
  var names = Object.values(config.instances).map(i => i.name);

  var files = fs.readdirSync(dir);
  for(var file in files) {
    if(file.endsWith(constants.TORRC_EXTENSION)) {
      let name = file.substring(0, -1*constants.TORRC_EXTENSION.length)
      if(names.indexOf(file.substring(0, -6)) == -1) {
        console.log("Removing old configuratoin for '" + name + "'");
        unlinkSync(path.join(dir, file));
      }
    }
  }
}

async function build(configs) {
  let policyFile = configs.exitPolicyFile 
                  || path.join(__dirname, '..', 'templates', 'policies', configs.exitPolicy + '.template')
  let data = {
    family: configs.familyPrefix ? await utilities.getFamily(configs.familyPrefix) : null,
    nickname: configs.familyPrefix + configs.name.replace(/[^a-zA-Z0-9]/,''),
    name: configs.name,

    ip: configs.ip,
    contactInfo: configs.contactInfo,
    dirPort: configs.dirPort,
    orPort: configs.orPort,
    dataDir: path.join(configs.dataDir, configs.name),
    dirFrontpage: configs.dirFrontpage,
    exitPolicy: fs.readFileSync(policyFile, 'utf8'),
    torNullPolicy: configs.includeTorNull ? await utilities.getRemoteFile(configs.torNullUrl) : ''
  }

  return Mustache.render(fs.readFileSync(configs.template, 'utf8'), data);
}