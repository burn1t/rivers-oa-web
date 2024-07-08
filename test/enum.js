function Enum(baseEnum) {
    return new Proxy(baseEnum, {
        get(target, name) {
            if (!baseEnum.hasOwnProperty(name))// 不存在
                throw new Error(`${name} value does not exist in the enum`)
            return baseEnum[name]
        },
        // 拦截修改操作
        set(target, name, value, receiver) {
            throw new Error('Cannot add a new value to the enum')
        }
    })
}

const ApplyFormOperateEnum = Enum({
    ADD: 'add',
    EDITOR: 'editor',
    DETAILS: 'details'
})

console.log(ApplyFormOperateEnum.DETAILS === 'add')
