const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Onionoo = require('onionoo');
const onionoo = new Onionoo({
  baseUrl: 'https://onionoo.torproject.org',
  endpoints: [
    'summary',
    'details',
    'bandwidth',
    'weights',
    'clients',
    'uptime'
  ],
  cache: new Map()
});

const ensureParentDirectoryExists = async function(file) {
  let parent = path.dirname(file);
  if(!fs.existsSync(parent)) {
    ensureParentDirectoryExists(parent);
    fs.mkdirSync(parent);
  }
}

module.exports = {
  getFamily: async function (prefix) {
    var query = {
      search: prefix
    };
    var response = await onionoo.summary(query);
    if(response.statusCode != 200)
      throw response;
        
    return response.body.relays.map(i => ({
      name: i.n,
      fingerprint: i.f,
      ip: i.a[0]
    }));
  },
  getRemoteFile: async function(url) {
    const response = await axios.get(url);
    return response.data;
  },
  getConfig: async function(argv) {
    var config = fs.existsSync(argv.database) ? JSON.parse(fs.readFileSync(argv.database, 'utf8')) : {};
    if(!config.instances) config.instances = {};

    return config;
  },
  saveConfig: async function(argv, data) {
    await ensureParentDirectoryExists(argv.database);
    fs.writeFileSync(argv.database, JSON.stringify(data), 'utf8');
  },
  ensureParentDirectoryExists: ensureParentDirectoryExists
}