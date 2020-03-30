const { promisify } = require('util');
let ncp = require('ncp');
const path = require('path');
const MetalSmith = require('metalsmith');
let { render } = require('consolidate').ejs;
const fs = require('fs');
const { fetchRepo } = require('./repo');
const { Inquirer } = require('./utils')

render = promisify(render);
ncp = promisify(ncp);
module.exports = async (projectName) => {
  // 获取下载后的目录
  const result = await fetchRepo();
  if (!fs.existsSync(path.join(result, 'ask.js'))) {
    await ncp(result, path.resolve(projectName));
  } else {
    console.log('复杂模板');
    // 让用户填信息
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname) // 传入路径，默认会遍历当前路径下的src文件夹
        .source(result)
        .destination(path.resolve(projectName))
        .use(async (files, metal, done) => {
          console.log(files)
          const args = require(path.join(result, 'ask.js'))
          const obj = await Inquirer.prompt(args)
          const meta = metal.metadata()
          Object.assign(meta, obj)
          console.log(obj)
          delete files['ask.js']
          done();
        })
        .use((files, metal, done) => {
          const obj = metal.metadata()
          console.log(metal.metadata())
          Reflect.ownKeys(files).forEach(async (file) => {
            // 处理js 或者json文件
            if (file.includes('json') || file.includes('js')) {
              let content = files[file].contents.toString()
              if (content.includes('<%')) {
                content = await render(content, obj)
                files[file].contents = Buffer.from(content)
              }
            }
          })
          // 根据用户的输入下载模板
          done();
        })
        .build((err) => {
          if (err) {
            console.log(err);
            reject()
          } else {
            resolve()
          }
        });
    });
  }
};
