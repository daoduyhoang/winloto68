//http://174.138.19.160:8088
const node_parser = require("node-html-parser")
const dateFormat = require('dateformat');
const parse = node_parser.parse
const https = require("https")
const dateToUrl = (date) => {
    return "https://www.minhngoc.net.vn/ket-qua-xo-so/mien-bac/" + date + ".html"
}

const getResult = (parsed, i) => {
    const key = i==0 ? '.giaidb' : '.giai' + i
    const text = parsed.querySelector(key).toString()
    const arr = text.split('<div>')
    let rs = []
    for (let i = 1; i < arr.length; i++) {
        let ele = arr[i]
        let nr = ele.split('</div>')[0]
        rs.push(nr)
    }
    return rs
}

const checkDate = (parsed, year, month, day) => {
  const lastDateString = parsed.querySelector('.tngay').toString()
  const date = day + '/' + month + '/' + year
  return lastDateString.includes(date)
}

const checkResult = (rs) => {
  if (rs.length !== 8) return false
  let sum = 0
  for (let giai = 0; giai < 8; giai ++) {
    let row = rs[giai]
    if (row.length < 1) return false
    for (let i = 0; i < row.length; i++) {
      if (isNaN(row[i])) return false
      sum++
    }
  }
  return sum===27
}

const getRawResult_MB = async (year, month, day) => {
    const date = day + '-' + month + '-' + year
    const url = dateToUrl(date)
    console.log(url)
    https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", () => {
        const parsed = parse(body)
        if (!checkDate(parsed, year, month, day)) {
          console.log('result not exist')
          return null
        }
        let rs = []
        for (let i = 0; i < 8; i++) {
            rs.push(getResult(parsed, i))
        }
        if (checkResult(rs)) {
          console.log(rs)
          return rs
        } else {
          console.log('result doesnt have correct format')
          return null
        }
    });
    })
}

// const now = new Date()
// let day = dateFormat(now, 'dd')
// let month = dateFormat(now, 'mm')
// let year = dateFormat(now, 'yyyy')
// let today = day + "-" + month + "-" + year
async function test() {
  rs = await getRawResult_MB('2019', '07', '27')
  console.log('xxx', rs)
}

test()

// function getKeoArray(from, to){
//     if (from.length !== to.length) return []
//     if (Number(from) > Number(to)) return []
//     let rs = []
//     for (let inc = 0; inc <= 9; inc++) {
//       let s = ''
//       for(let i = 0; i < from.length; i++) {
//         if (from[i] === to[i]) {
//           s += from[i]
//         } else {
//           if (Number(from[i]) + inc > Number(to[i])) return rs
//           s+=Number(from[i]) + inc
//         }
//       }
//       rs.push(s)
//     }
//     return rs
//   }
  
  // console.log(getKeoArray('070', '079'))

//   function getTime() {
//     offset=7
//     // create Date object for current location
//     var d = new Date();

//     // convert to msec
//     // subtract local time zone offset
//     // get UTC time in msec
//     var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

//     // create new Date object for different city
//     // using supplied offset
//     var now = new Date(utc + (3600000*offset));
//     // let day = dateFormat(now, 'dd')
//     // let month = dateFormat(now, 'mm')
//     // let year = dateFormat(now, 'yyyy')
//     // var hour = dateFormat(now,'HH')
//     // var min = dateFormat(now,'MM')
//     const rs = {
//       year: dateFormat(now, 'yyyy'),
//       month: dateFormat(now, 'mm'),
//       day: dateFormat(now, 'dd'),
//       hour: dateFormat(now,'HH'),
//       min: dateFormat(now,'MM')
//     }
//     return rs
//     // console.log('xxx', year)
//     // console.log('xxx', month)
//     // console.log('xxx', day)
//     // console.log('xxx', hour)
//     // console.log('xxx', min)
//     // // return time as a string
//     // return "The local time for city"+ city +" is "+ now.toLocaleString();
// }

// console.log(calcTime('Hanoi', '+7'))