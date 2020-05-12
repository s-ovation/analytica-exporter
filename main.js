const exporter = require('./app/exporter')
const argv = require('yargs')
  .usage('Usage $0 [COMMAND] --groupName [group name] --email [email] --password [password]')
  .command('query', 'export queries')
  .command('transform', 'export transforms')
  .demandCommand(1, 'コマンドを指定してください')
  .option('groupName', { describe: 'グループ名' })
  .option('email', { describe: 'Eメール' })
  .option('password', { describe: 'パスワード' })
  .demandOption(['groupName', 'email', 'password'])
  .argv;

(async () => {
  const cmd = argv._[0]
  if (cmd === 'query') {
    const items = await exporter.getQueries(argv.groupName, argv.email, argv.password)
    exporter.exportToJson('analytica_queries.json', items)
  } else if (cmd === 'transform') {
    const items = await exporter.getTransforms(argv.groupName, argv.email, argv.password)
    exporter.exportToJson('analytica_transforms.json', items)
  } else {
    console.error('Unknown command, Use --help to see commands')
    process.exit(1)
  }
})()
