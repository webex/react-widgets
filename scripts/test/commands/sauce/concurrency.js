const {getSauceConcurrency} = require('../../../utils/sauce');

module.exports = {
  command: 'concurrency',
  desc: 'Get current concurrency status of sauce account',
  builder: {
    remaining: {
      describe: 'Output remaining spots'
    }
  },
  handler: ({remaining}) => {
    getSauceConcurrency((data) => {
      if (remaining) {
        const {ancestor} = data.concurrency;
        console.log(ancestor.allowed.overall - ancestor.current.overall);
      }
      console.log(data);
    });
  }
};
