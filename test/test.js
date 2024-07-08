let options = [
    {
        value: 'Floyd',
        label: 'Floyd'
    },
    {
        value: 'Chris',
        label: 'Chris'
    },
    {
        value: 'Tina',
        label: 'Tina'
    }
]

const username = 'Floyd'

const evenNumbers = options.filter(option =>
    option['value'] !== username
)
console.log(options)
console.log(evenNumbers)