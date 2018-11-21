try {
    test()
} catch (error) {
    console.log(error, 'error....')
}

try {
    setTimeout(() => {
        test()
    })
} catch (error) {
    console.log(error)
}