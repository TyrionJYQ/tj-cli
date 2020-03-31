const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

let ncp = require('ncp');

const MetalSmith = require('metalsmith');
let { render } = require('consolidate').ejs;

const { fetchRepo } = require('../repo');
const { Inquirer, log } = require('../utils');

render = promisify(render);
ncp = promisify(ncp);

module.exports = async (projectName) => {
  if (!projectName) {
    return log('create command must use a projectName', 'red');
  }
  // 获取下载后的目录
  const result = await fetchRepo();
  if (!fs.existsSync(path.join(result, 'ask.js'))) {
    await ncp(result, path.resolve(projectName));
  } else {
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname) // 传入路径，默认会遍历当前路径下的src文件夹
        .source(result)
        .destination(path.resolve(projectName))
        .use(async (files, metal, done) => {
          const args = require(path.join(result, 'ask.js'));
          const obj = await Inquirer.prompt(args);
          const meta = metal.metadata();
          Object.assign(meta, obj);
          delete files['ask.js'];
          done();
        })
        .use((files, metal, done) => {
          const obj = metal.metadata();
          Reflect.ownKeys(files).forEach(async (file) => {
            // 处理js 或者json文件
            if (file.includes('json') || file.includes('js')) {
              let content = files[file].contents.toString();
              if (content.includes('<%')) {
                content = await render(content, obj);
                files[file].contents = Buffer.from(content);
              }
            }
          });
          // 根据用户的输入下载模板
          done();
        })
        .build((err) => {
          if (err) {
            log(err.toString(), 'red');
            reject();
          } else {
            resolve();
          }
        });
    });
  }
};
