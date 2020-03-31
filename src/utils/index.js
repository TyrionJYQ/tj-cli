const ora = require('ora');
const Inquirer = require('inquirer')
const log = require('./log')

const wrapperFunctionWithLoading = (fn, description) => async (...args) => {
  const spinner = ora(description);
  spinner.start()
  console.log(args)
  const result = await fn(...args)
  spinner.succeed()
  return result
}

const downloadDirectory = `${process.env[process.platform === 'darwin'
  ? 'HOME' : 'USERPROFILE']}\\.tempalte`

module.exports = {
  wrapperFunctionWithLoading,
  Inquirer,
  downloadDirectory,
  log,
};
