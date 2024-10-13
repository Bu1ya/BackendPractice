const isAlphanumeric = (value) => {
    return /^[a-z0-9]+$/i.test(value)
}

module.exports = { isAlphanumeric }