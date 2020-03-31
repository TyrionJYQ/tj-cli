module.exports = {
  create: {
    alias: 'c',
    description: 'create a new project',
    examples: [
      'tj-cli create <project-name>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'config project varible',
    examples: [
      'tj-cli config set <key> <value>',
      'tj-cli config get <key>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
}
