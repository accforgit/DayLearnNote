```ts
// 解决 js 四则运算可能出现的精度问题
// 没直接引入一个库的原因是，库体积太大了，现有项目基本上只涉及四则运算，引入库的性价比太低

/**
 * 获取小数位的位数
 * @param num 数字
 */
function decimalLen (num: number): number {
  let len: number = 0
  try {
    len = num.toString().split('.')[1].length
  } catch (e) {/**/}
  return len
}

function toBigInt (num: number): number {
  return Number(num.toString().replace('.', ''))
}

/**
 * js 四则运算 加法
 * @param num1 第一个数字
 * @param num2 第二个数字
 */
export const numberAdd = (num1: number, num2: number): number => {
  let m = Math.pow(10, Math.max(decimalLen(num1), decimalLen(num2)))
  // 由于存在类似于 4.94 * 100 === 494.00000000000006 的情况，所以这里使用 toFixed 再截取一下
  return (Number((num1 * m).toFixed()) + Number((num2 * m).toFixed())) / m
}
/**
 * js 四则运算 减法
 * @param num1 第一个数字
 * @param num2 第二个数字
 */
export const numberSub = (num1: number, num2: number): number => {
  return numberAdd(num1, -num2)
}
/**
 * js 四则运算 乘法
 * @param num1 第一个数字
 * @param num2 第二个数字
 */
export const numberMul = (num1: number, num2: number): number => {
  return toBigInt(num1) * toBigInt(num2) / Math.pow(10, decimalLen(num1) + decimalLen(num2))
}
/**
 * js 四则运算 除法
 * @param num1 第一个数字
 * @param num2 第二个数字
 */
export const numberDivision = (num1: number, num2: number): number => {
  return toBigInt(num1) / toBigInt(num2) * Math.pow(10, decimalLen(num2) - decimalLen(num1))
}
```