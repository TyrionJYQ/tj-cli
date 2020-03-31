const path = require('path')
const program = require('commander')
const { version } = require('./constants')
const actions = require('./command/actions')


Object.keys(actions).forEach((action) => {
  const { alias, description, examples } = actions[action]
  program
    .command(action)
    .alias(alias)
    .description(description)
    .action(() => {
      if (action !== '*') {
        require(path.resolve(__dirname, `command\\${action}`))(...process.argv.slice(3))
      } else {
        console.log(description)
      }
    })
})


program.version(version).parse(process.argv)
