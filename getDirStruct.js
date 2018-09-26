/**
 * 用于生成仓库目录的层级结构
 */

const path = require('path')
const fs = require('fs')
 
const excludeFile = ['LICENSE', 'README.md', 'img', 'getDirStruct.js']
const absolutePath = []
const struct = {}

// 获取所有文件路径
;(function getDirStruct(p = __dirname, originStruct = struct) {
  const files = fs.readdirSync(p)
  files.forEach(file => {
    if (excludeFile.indexOf(file) !== -1 || file.indexOf('.') === 0) return
    const fileStats = fs.statSync(path.resolve(p, file))
    if (fileStats.isDirectory(file)) {
      return getDirStruct(path.resolve(p, file), originStruct)
    } else {
      absolutePath.push(path.resolve(p, file))
    }
  })
})()
// 不同系统平台的分隔符处理
const sep = path.sep
let pattern = '/'
if (sep.indexOf('\\') !== -1) {
  pattern = '\\\\'
}
// 文件的相对路径数组
const relativePath = absolutePath.map(struct => {
  return struct.replace(__dirname, '').replace(new RegExp(pattern, 'g'), '/')
})

const structs = {}
relativePath.forEach(filePath => {
  const fileArrs = filePath.split('/').filter(p => p)
  let currentProp = eval('structs' + fileArrs.slice(0, -1).reduce((t, c) => {
    if (!eval('structs' + t + `['${c}']`)) {
      eval('structs' + t + `['${c}']` + '={}')
    }
    return t + `['${c}']`
  }, ''))

  if (currentProp.directChildren) {
    currentProp.directChildren.push(fileArrs.slice(-1)[0])
  } else {
    currentProp.directChildren = fileArrs.slice(-1)
  }
})

// README.md 中的内容
let readmeContent = `
# DayNote

读书笔记，记录学习过程遇到的任何知识点

此仓库会频繁更新，推荐 \`star\` 或 \`watch\`以即时得到更新通知

---

`
// 整理输出结构
;(function formatLink(obj = structs, basePath = '', level = 1) {
  Object.keys(obj).forEach(k => {
    readmeContent += ('\t'.repeat(level - 1) + '|----' + `[${k}](${basePath + '/' + k})` + '\n\n')
    if (obj[k].directChildren) {
      obj[k].directChildren.forEach(d => {
        readmeContent += ('\t'.repeat(level) + '|----' + `[${d}](${basePath + '/' + k + '/' + d})` + '\n\n')
      })
    }
    const objKeys = Object.keys(obj[k])
    if (objKeys.length > 1 || objKeys !== 'directChildren') {
      const tempObj = {}
      objKeys.filter(d1 => d1 !== 'directChildren').forEach(d2 => {
        tempObj[d2] = obj[k][d2]
      })
      return formatLink(tempObj, `${basePath}/${k}`, level + 1)
    }
  })
})()

fs.writeFile(path.resolve(__dirname, 'README.md'), readmeContent, (err, result) => {
  console.log('done')
})
