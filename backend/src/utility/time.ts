const dateFormat = require('dateformat');
function getTime(dist) {
    const offset=7
    const toSub = dist * 24 * 3600 * 1000
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000) - toSub;

    // create new Date object for different city
    // using supplied offset
    var now = new Date(utc + (3600000*offset));
    // let day = dateFormat(now, 'dd')
    // let month = dateFormat(now, 'mm')
    // let year = dateFormat(now, 'yyyy')
    // var hour = dateFormat(now,'HH')
    // var min = dateFormat(now,'MM')
    const rs = {
      year: dateFormat(now, 'yyyy'),
      month: dateFormat(now, 'mm'),
      day: dateFormat(now, 'dd'),
      hour: dateFormat(now,'HH'),
      min: dateFormat(now,'MM')
    }
    return rs
    // console.log('xxx', year)
    // console.log('xxx', month)
    // console.log('xxx', day)
    // console.log('xxx', hour)
    // console.log('xxx', min)
    // // return time as a string
    // return "The local time for city"+ city +" is "+ now.toLocaleString();
}

export default getTime;