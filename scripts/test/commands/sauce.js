module.exports = {
  command: 'sauce <command>',
  desc: 'Manage sauce tests',
  builder: (yargs) => yargs.commandDir('sauce'),
  handler: () => {}
};
