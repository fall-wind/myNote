const mobx = require('mobx')

const { observable, computed, decorate } = mobx

class Test {
    id = '1'
    // @observable
    // list = [1, 2]

    // // @computed
    // get len() {
    //     return this.list.length
    // }
}

decorate(Test, {
    id: observable,
    list: observable,
    len: computed,
})

const test1 = new Test()

test1.list.push(1)
