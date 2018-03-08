// 查找1- n 的质数

const findPrimeNumber = (n) => {
    const primeArr = []
    let i, j

    for(i = 1; i < n + 1; i++) {
        for(j = 2; j < i; j++) {
            if (i % j == 0) {
                break
            }
        }
        if(i <= j && i != 1){
            primeArr.push(i)
        }
    }
    return primeArr
}

