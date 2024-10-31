const formatDateTime = (dateTime) => {
    dateTime.toString().replace(/(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}:\d{2}:\d{2})/, '$3-$1-$2 $4')

    return dateTime
}

module.exports = { formatDateTime }