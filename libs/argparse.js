var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Runs KPI WebService.'
});
parser.addArgument(
  ['--database'],
  {
      help: '(Re)generates database. This will empty all data.',
      action: 'storeTrue'
  }
);

var args = parser.parseArgs();

module.exports = args;
