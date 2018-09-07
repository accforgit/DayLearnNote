
## 数组去重
```js
let unique = (array)=>{
    let hashTable = {}
    let data = []
    let len = array.length
    for (let i=0; i<len; i++) {
        if(!hashTable[array[i]]) {
            hashTable[array[i]] = true
            data.push(array[i])
        }
    }
    return data
}
unique([1,13,24,11,11,14,1,2])
```

## 统计一个字符串中出现最多的字母

```js
let findMaxDuplicateChar = (str)=>{
    let len = str.length
    if (len === 1) {
        return str
    }

    let charObj = {}
    for(let i=0;i<len; i++) {
        if(!charObj[str.charAt(i)]){
            charObj[str.charAt(i)] = 1
        }
        else {
            charObj[str.charAt(i)] += 1
        }
    }

    let maxChar = '',maxValue = 1
    for (let k in charObj) {
        if(charObj[k] >= maxValue) {
            maxValue = charObj[k]
            maxChar = k
        }
    }

    return maxChar
}
```

## 找出正数组的最大差值

```js
function(array) {
    let len = array.length
    if(len === (1 || 0)){
        return array
    }
    else if(len === 2) {
        return Math.abs(array[0]-array[1])
    }

    let minValue = array[0]
    let maxProfit = 0
    let currentValue
    for(let i =1; i<len; i++) {
        currentValue = array[i]
        minValue = Math.min(currentValue,minValue)
        maxProfit = Math.max(maxProfit,currentValue - minValue)
    }

    return maxProfit
}
```

## 随机生成指定长度的字符串
```js
function randomString(n) {
    let str = 'abcdefghijklmnopqrstuvwxyz9876543210'
    let result = ''
    let len = str.length
    for(let i =0; i<n; i++) {
        result += str.charAt(Math.floor(Math.random()*len))
    }
    return result
}
```

## 实现类似getElementsByClassName 的功能

自己实现一个函数，查找某个DOM节点下面的包含某个class的所有DOM节点，
不允许使用原生提供的 `getElementsByClassName querySelectorAll` 等原生提供DOM查找函数。

注意：以下代码别忘了使用反斜杠转义,node 代表从HTML文档中获取的节点，
例如 `var node = document.getElementById('tag')`

```js
function queryClassName(node,name) {
	let starts = "(^|[ \\n\\r\\f\\t])"
	let ends = "([ \\n\\r\\f\\t]|$)"
	let array = []
	let regex = new RegExp(starts+name+ends)
	let elements = node.getElementsByTagName('*')
	let len = elements.length
	let element,i=0

	while(i < len) {
		element = elements[i]
		if(regex.test(element.className)) {
			array.push(element)
		}
		i += 1
	}
	return array
}
```

## 实现二叉查找树(Binary Search Tree)

&emsp;&emsp;二叉查找树，也称二叉搜索树、有序二叉树（英语：ordered binary tree）是指一棵空树或者具有下列性质的二叉树：

>(1) 任意节点的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
>(2) 任意节点的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
>(3) 任意节点的左、右子树也分别为二叉查找树；
>(4) 没有键值相等的节点。二叉查找树相比于其他数据结构的优势在于查找、插入的时间复杂度较低。
    为O(log n)。二叉查找树是基础性数据结构，用于构建更为抽象的数据结构，如集合、multiset、关联数组等。


```js
// 二叉查找树节点的数据结构
class Node {
    constructor(data, left, right) {
        this.data = data
        this.left = left
        this.right = right
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null
    }

    // 插入节点
    insert(data) {
        let n = new Node(data,null,null)
        if(!this.root) {
            return this.root = n
        }

        let currentNode = this.root

        let parent = null
        while(true){
            parent = currentNode
            if(data < currentNode.data) {
                currentNode = currentNode.left
                if(currentNode === null) {
                    parent.left = n
                    break
                }
            }
            else {
                currentNode = currentNode.right
                if(currentNode === null) {
                    parent.right = n
                    break
                }
            }
        }
    }

    // 删除节点
    remove(data) {
        this.root = this.removeNode(this.root,data)
    }

    removeNode(node, data) {
        if(node == null) {
            return null
        }
        // 如果要删除的节点就是根节点
        if(data == node.data) {
            //如果根节点没有子节点
            if(node.left == null && node.right == null) {
                return null
            }
            //如果根节点只是没有左节点，那么就返回右节点，作为整棵二叉树的根节点
            if(node.left == null) {
                return node.right
            }
            //如果根节点只是没有右节点，那么就返回左节点，作为整棵二叉树的根节点
            if(node.right == null) {
                return node.left
            }

            //如果根节点的左右节点都存在，那么根节点需要从左、右两个子二叉树中寻找，
            //并且这个节点需要满足比根节点的左节点二叉树上的任意节点大，比根节点的右节点二叉树上的任意节点小，
            //所以这个节点只可能从右节点的二叉树中寻找，并且找的是右节点的二叉树中值最小的那个节点，
            //所以是在右节点的二叉树中的左节点树上寻找
            let getSmallest = (node)=>{
                //如果右节点没有子节点，则直接返回右节点
                if(node.left == null && node.right == null) {
                    return node
                }

                let tempNode = null
                if(node.left !== null) {
                    tempNode = node.left
                    while(true) {
                        if(tempNode.left === null && tempNode.right === null) {
                            break
                        }
                        if(tempNode.left !== null){
                            tempNode = tempNode.left
                        }
                        else {
                            tempNode = tempNode.right
                        }
                    }
                    return tempNode
                }
                if(node.right !== null) {
                    return getSmallest(node.right)
                }
            }
            //获取根节点右节点的子节点
            let temNode = getSmallest(node.right)
            node.data = temNode.data
            // 把已经作为根节点的右子节点树上最小的节点删掉
            node.right = this.removeNode(node.right,temNode.data)
            return node
        }
        //如果要删除的节点是根节点的左节点
        else if(data < node.data) {
            //那就把根节点的左节点删除，并利用递归将删除了左节点的左二叉树排好序
            node.left = this.removeNode(node.left,data)
            return node
        }
        //如果要删除的节点是根节点的右节点
        else {
            //那就把根节点的右节点删除，并利用递归将删除了右节点的右二叉树排好序
            node.right = this.removeNode(node.right,data)
            return node
        }
    }

    // 查找二叉树的节点
    find(data) {
        let current = this.root
        // 使用while循环向下查找
        while(current !== null) {
            //如果要查找的节点就是当前节点，也就是说已经找到了
            if(data == current.data) {
                break
            }
            //如果要查找的节点是当前节点的左节点
            if(data < current.data) {
                current = current.left
            }
            else {
                current = current.right
            }
        }
        if(current) {
            return current.data
        }
        else {
            return null
        }
    }
}
```

## 选择排序
>&emsp;&emsp;从所有序列中先找到最小的，然后与数组第一个位置的元素交换，也就是把最小的元素放在第一位，
之后再看剩余元素中最小的，再与第二个位置的元素交换，全部完成交换。
属于 `固定位置找元素` 的模式。

- 首先在待排序序列中找到最小元素，放入储存有序序列中。同时从待排序序列中删除这个元素
- 继续从未排序序列中找到最小元素，然后a步中的有序列序列中
- 以此类推，直到待排序序列元素个数为0

```js
function selectSort(array) {
    let len = array.length
    let minIndex, minValue
    for(let i=0; i<len-1; i++) {
        minIndex = i
        for(let j=i+1; j<len; j++) {
            if(array[minIndex] > array[j]) {
                minIndex = j
            }
        }
        minValue = array[minIndex]
        array[minIndex] = array[i]
        array[i] = minValue
    }
    return array
}
```

##  直接插入排序

每一趟将一个待排序的记录(也就是新数据)，
按照其关键字的大小插入到有序队列的合适位置里，直到全部插入完成。
属于 `固定元素找位置` 的模式。

>a. 从待排序序列第0个元素开始排序，该元素可以认为已经是有序的
>b. 取出下一个元素，在已经排序的元素序列中从后向左遍历
>c. 如果已排序元素大于新元素，将该元素移到下一位置
>d. 重复步骤c，直到找到一个已排序的元素，此元素不大于新元素；或者元素位于有有序序列开始位置
>e. 将新元素插入到此元素后面
>f. 重复步骤b~e,直接待排元素个数为0

```js
function insertSort(array) {
    let len = array.length
    let i, j, temp
    for(i=1; i<len; i++){
        for(j = i-1; j >= 0 && array[j+1]<array[j]; j--) {
            temp = array[j+1]
            array[j+1] = array[j]
            array[j] = temp
        }
    }
    return array
}
```

## 冒泡排序

从头到尾依次交换，将较大的值交换到后面的位置

>a. 从头开始比较相邻的两个待排序元素，如果前面元素大于后面元素，就将二个元素位置互换
>b. 这样对序列的第0个元素到n-1个元素进行一次遍历后，最大的一个元素就“沉”到序列的最后位置（第n-1个位置，n为待排序元素个数）
>c．排除此次排序最后面的那个元素(n=n-1)，继续对剩余序列重复前面两步
>d. 当(n= n-1)=0时，排序完成

```js
let bubbleSort = (array) =>{
    let len = array.length
    if(len === 1) {
        return array
    }
    let temp = null
    for(let i=0; i<len-1; i++){
        for(let j=i+1; j<len; j++) {
            if(array[i] > array[j]) {
                temp = array[i]
                array[i] = array[j] 
                array[j] = temp
            }
        }
    }

    return array
}
```

## 快速排序

从数组中任意选取一个元素作为基准值（为了方便计算，一般使用第一个元素值），
然后再从剩下的数组中依次取出值与基准值比较，比基准值大的放到基准值的右边，否则放到左边，
计算完一轮过后，再分别将基准值左右两边的元素划分成更小的数组对待，为每个子数组都单独设置基准值，
递归完成排序。

```js
let quickSort =(array) =>{
    let len = array.length
    //注意，这里的递归出口不是len === 1
    if(len <= 1){
        return array
    }

    let leftArr = []
    let rightArr = []
    let q = array[0]

    for(let i=1; i<len; i++) {
        if(array[i] > q) {
            rightArr.push(array[i])
        }
        else{
            leftArr.push(array[i])
        }
    }
    return [].concat(quickSort(leftArr),q,quickSort(rightArr))
}

```

## 希尔排序

先设定一个小于数组长度的步长d1，然后根据步长d1将数组中元素分组，
在每个子组中使用`直接插入排序`进行排序，排序好之后，再选取一个小于d1的步长d2,
然后根据步长d2将得到的新数组中的元素进行分组，接着在每个子组中使用`直接插入排序`进行排序。
重复上述分组和插入排序，直到所选取的`步长=1`，即所有记录放在同一组中进行直接插入排序为止。    

>a. 设定一个间距d1(d1 < len)，将待排序序列分组
>b. 对分组使用插入排序
>c. 改变d2(d2<d1), 再次分组
>d. 再次对上面的分组使用插入排序
>e. 重复上面的步骤，直至dn=1，并进行最后一次插入排序，得到排好序的序列

第一种希尔排序，设定好的步长

```js
function shellsort1(array){
    var gaps = [5,3,1],temp;
    for(var g = 0;g <gaps.length; g++){
        for(var i = gaps[g];i<array.length;i++){
            // 将需要排序的元素暂存起来
            temp = array[i];
            // 每次跨越一个步长的长度，相当于是在同一个组中，从前往后比较，
            // 如果同一组中前面的值比后面的大，则将前面元素的值赋给后面的元素（也就是需要排序的元素）
            for(var j = i;j >= gaps[g] && array[j-gaps[g]] > temp;j = j-gaps[g]){
                // 同一组中的前后元素进行赋值
                array[j] = array[j-gaps[g]];
            }
            array[j] = temp;
        }
    }
    return array
}
```

第二种希尔排序，动态计算步长
```js
function shellsort2(array){
    let len = array.length
    let gap, temp, i, j
    for(gap=Math.floor(len/2); gap>0; gap=Math.floor(gap/2)) {
        // 开始直接插入排序
        for(i=gap; i<len; i++) {
            temp = array[i]
            for(j=i-gap; j>=0 && array[j]>temp; j-=gap) {
                array[j+gap] = array[j]
            }
            array[j+gap] = temp
        }
    }
    return array
}
```

## 归并排序
[JavaScript实现归并排序](http://www.108js.com/article/article5/50032.html?id=692)

```js
// 排序并合并
function merge(left, right) {
    let result = []
    while(left.length>0 && right.length>0) {
        if(left[0]<right[0]) {
            result.push(left.shift())
        }
        else {
            result.push(right.shift())
        }
    }

    return result.concat(left, right)
}

function mergeSort(array) {
    if(array.length <= 1) {
        return array
    }

    let mid = Math.floor(array.length/2)
    let left = array.slice(0, mid)
    let right = array.slice(mid)

    return merge(mergeSort(left), mergeSort(right))
}

console.log(mergeSort([23,53,6,1,7,8,0,54,67,2,34]))
```
