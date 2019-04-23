let childFiber1 = null
let fiber = null
let childFiber2 = null

childFiber2 = {
    key: '1-1',
    name: 'child1',
    return: fiber,
    sibling: null,
    child: null,
}

childFiber1 = {
    key: '1-1',
    name: 'child1',
    return: fiber,
    sibling: childFiber2
}
fiber = {
    key: '1',
    name: 'parent',
    return: null,
    child: childFiber1
}