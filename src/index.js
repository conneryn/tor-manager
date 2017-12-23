#!/usr/bin/env node

const path = require('path');
const osUtilities = require('./utilities/osUtilities');

require('yargs')
  .option('database', {
    alias: 'db',
    describe: 'Database file of active bindings',
    default: osUtilities.DEFAULT_CONFIG_DB,
    coerce: path.resolve
  })
  .commandDir('commands')
  .demandCommand()
  .help()
  .argv;