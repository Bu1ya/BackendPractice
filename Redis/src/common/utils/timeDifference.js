const timeDifference = (datetime1, datetime2) => {
    const date1 = new Date(datetime1.toString().replace(' ', 'T'));
    const date2 = new Date(datetime2.toString().replace(' ', 'T'));
  
    const diff =  date2 - date1;

    return diff > 0 ? diff : 0
}

module.exports = { timeDifference }