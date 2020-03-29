const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')

async function fetchRepos() {
  const { data } = await axios.get('https://api.github.com/users/TyrionJYQ/repos')
  return data
}
module.exports = async () => {
  const spinner = ora('fetching template...')
  spinner.start()
  let repos = await fetchRepos()
  spinner.succeed()
  repos = repos.map((repo) => repo.name)
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'choice a repo',
    choices: repos,
  })
  console.log(repo)
  return repos
}
