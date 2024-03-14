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

const dateToString = (year, month, day) => {
  return year + '-' + month + '-' + day
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

const getRawResult_MB = async (DB_result, year, month, day) => {
    const date = day + '-' + month + '-' + year
    const url = dateToUrl(date)
    console.log(url)

    return await https.get(url, res => {
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
          const doc = {
            dai: 'MB',
            date: dateToString(year, month, day),
            id: 'mb-' + dateToString(year, month, day),
            data: rs
          }
          DB_result.save(doc)
        } else {
          console.log('result doesnt have correct format')
          return null
        }
    });
    })
}

// const Result_MB = {
//     async get(year, month, day){
//         return await getRawResult_MB(year, month, day);
//     },
// };

export default getRawResult_MB;
