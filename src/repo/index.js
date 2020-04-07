const axios = require('axios');
const { promisify } = require('util');
let downloadGitRepo = require('download-git-repo');
const { wrapperFunctionWithLoading, Inquirer } = require('../utils');
const { downloadDirectory } = require('../constants');
// eslint-disable-next-line consistent-return
downloadGitRepo = promisify(downloadGitRepo);

// const fetchRepos = async () => {
//   try {
//     const { data } = await axios.get(
//       'https://api.github.com/users/TyrionJYQ/repos',
//     );
//     return data
//     // return data.filter((repo) => repo.name === 'vue-template');
//   } catch (err) {
//     console.log(err);
//   }
// };

const fetchTags = async (repo) => {
  const { data } = await axios.get(
    `https://api.github.com/repos/TyrionJYQ/${repo}/tags`,
  );
  return data;
};

const downloadRepo = async (repo, tag) => {
  let api = `TyrionJYQ/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  console.log(api)
  const dest = `${downloadDirectory}\\${repo}`;
  await downloadGitRepo(api, dest);
  return dest;
};

const fetchRepo = async () => {
  // let repos = await wrapperFunctionWithLoading(
  //   fetchRepos,
  //   'downloading template...',
  // )();
  // repos = repos.map((repo) => repo.name)
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'choose a repo',
    choices: ['vue-template'],
  });

  const tags = await wrapperFunctionWithLoading(
    fetchTags,
    'downloading tags...',
  )(repo);

  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'choose a tag',
    choices: tags,
  });
  const result = await wrapperFunctionWithLoading(downloadRepo, 'downloading repo you choose...')(repo, tag);
  return result
};


module.exports = {
  fetchRepo,
};
