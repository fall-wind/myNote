const p1 = (val) => {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(val)
        }, 400)
    })
}

async function aa() {
    let result = await p1('1111')
    console.log(result, 100)
    throw new Error('error......')
    console.log('????')
    return p1
}

async function bb(params) {
    // console.log('bbbbb')
    const p1 = await aa()
    const result = await p1(11111)
    console.log(result, 100)
}

// bb()

const asyncObj = {
    async aa() {
        const result = await p1('3333')
        console.log(result, '???')
    },
    bb,
}

// aa().then((result) => {
//     console.log(result, 'xxx')
// }, (err) => {
//     console.log(err, '???')
// })

// async function ww(params) {
//     try {
//         await Promise.reject('err')
//     } catch (error) {
//         console.log('l am error', error)
//     }
//     return await Promise.resolve('hello')
// }

// ww().then((v) => {
//     console.log(v, '???')
// }, err => {
//     console.log(err, '???111')
// })

async function ww(params) {
    const [a, b] = await Promise.all([p1('hello'), p1('world')])
    console.log(a, b)

    const p11 = p1('hi')
    const p22 = p1('ni hao')

    const aa = await p11
    console.log(aa)
    const bb = await p22
    console.log(bb)

    const aaa = await p1('g')
    console.log(aaa)
    const bbb = await p1('g')
    console.log(bbb)
}

ww()