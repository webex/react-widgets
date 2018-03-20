module.exports = {
  command: 'automation <command>',
  desc: 'Manage automation tests',
  builder: (yargs) => yargs.commandDir('automation'),
  handler: () => {}
};
