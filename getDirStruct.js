/**
 * 用于生成仓库目录的层级结构
 */
const path = require('path')
const fs = require('fs')

// 文件名在下面数组中项的都排除掉
const excludeFile = ['img', 'LICENSE', 'README.md', path.basename(__filename)]
// 文件名以下面数组中项为前缀开头的都排除掉
const excludePrefix = ['.']
// 所有文件的绝对全路径缓存数组
const absolutePath = []

// 获取所有文件路径
;(function getDirStruct(basePath = __dirname) {
  const files = fs.readdirSync(basePath)
  // 空文件夹处理
  if (files.length === 0) {
    return absolutePath.push(basePath)
  }
  files.forEach(file => {
    // 排除掉不想显示的文件
    if (excludeFile.indexOf(file) !== -1 || excludePrefix.some(pre => file.indexOf(pre) === 0)) return
    const fullPath = path.resolve(basePath, file)
    const fileStats = fs.statSync(fullPath)
    // 如果是文件夹，则继续遍历其子文件
    return fileStats.isDirectory() ? getDirStruct(fullPath) : absolutePath.push(fullPath)
  })
})()
// 文件的相对路径数组，用于拼接 url地址
const isWin = path.sep.indexOf('\\') !== -1
let relativePath = absolutePath.map(apath => {
  // 得到相对路径
  const rPath = path.relative(__dirname, apath)
  // 不同系统平台的分隔符处理
  return isWin ? rPath.replace(/\\/g, '/') : rPath
})

// 层级结构
const structs = {}
relativePath.forEach(filePath => {
  // 格式化路径为数组
  const fileArrs = filePath.split('/')
  let currentProp = eval('structs' + fileArrs.slice(0, -1).reduce((t, c) => {
    if (!eval('structs' + t + `['${c}']`)) {
      eval('structs' + t + `['${c}']` + '= {}')
    }
    return t + `['${c}']`
  }, ''))
  if (currentProp._children) {
    currentProp._children.push(fileArrs.slice(-1)[0])
  } else {
    currentProp._children = fileArrs.slice(-1)
  }
})

// README.md 中的内容
let readmeContent = `
# DayNote

读书笔记，记录学习过程遇到的任何知识点

此仓库会频繁更新，推荐 \`star\` 或 \`watch\`以即时得到更新通知

---

目录结构

`
// 整理输出结构
;(function formatLink(obj = structs, basePath = '', level = 1) {
  Object.keys(obj).forEach(k => {
    if (k === '_children') {
      // 这个是针对根目录下存在的独立文件
      return readmeContent += obj[k].reduce((t, c) => t + `- [${c}](/${c})\n`, '')
    }
    readmeContent += ('\t'.repeat(level - 1) + `- [${k}](${basePath}/${k})\n`)
    // 如果存在子层级，则遍历子层级
    if (obj[k]._children) {
      readmeContent += obj[k]._children.reduce((t, c) => {
        return t + '\t'.repeat(level) + `- [${c}](${basePath}/${k}/${c})\n`
      }, '')
    }
    const objKeys = Object.keys(obj[k])
    // 如果子层级存在并且不止一个，或者子层级只有一个但属性名不是 _children
    if (objKeys.length > 1 || (objKeys.length && objKeys[0] !== '_children')) {
      const tempObj = {}
      objKeys.filter(d1 => d1 !== '_children').forEach(d2 => {
        tempObj[d2] = obj[k][d2]
      })
      return formatLink(tempObj, `${basePath}/${k}`, level + 1)
    }
  })
})()

// 保存 README.md
fs.writeFile(path.resolve(__dirname, 'README.md'), readmeContent, () => {
  console.log('done')
})
