const chalk = require('chalk');

module.exports = (info, color = 'white') => console.log(chalk[color](info))
