
// 假设k 有效 
// nums.length > k
const SlidingWindowMedian = (nums = [] ,k) => {
    const arr = []
    for (let position = 0; position < (nums.length - k + 1); position++) {
        const subArr = nums.slice(position, k + position).sort((x,y) => x-y)
        const mid = Math.floor(k / 2)
        if (k % 2 === 0) {
            const value = (subArr[mid - 1] + subArr[mid]) / 2
            arr.push(value)
        } else {
            arr.push(subArr[mid])
        }
    }
    console.log(arr)
    return arr
}

SlidingWindowMedian([1,3,-1,-3,5,3,6,7], 3)

SlidingWindowMedian([1,4,2,3], 4)

SlidingWindowMedian([7,0,3,9,9,9,1,7,2,3], 6)

