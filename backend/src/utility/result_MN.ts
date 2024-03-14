const node_parser = require("node-html-parser")
const dateFormat = require('dateformat');
const parse = node_parser.parse
const https = require("https")
const dateToUrl = (date) => {
    return "https://www.minhngoc.net.vn/ket-qua-xo-so/mien-nam/" + date + ".html"
}

const getResult = (parsed) => {
  const key = '.box_kqxs'
  const selectedResult = parsed.querySelector(key)
  const dais = selectedResult.querySelectorAll(".rightcl")
  let rs = []
  dais.forEach(dai => {
    // console.log(dai.toString())
    const name = dai.querySelector('.tinh').querySelector('a').innerHTML
    const code = dai.querySelector('.matinh').innerHTML.replace(/ /g,'').trim().toLowerCase()
    let data = []
    for(let i = 0; i < 9; i++) {
      const key = i==0 ? '.giaidb' : '.giai' + i
      const rawArr = dai.querySelector(key).querySelectorAll('div')
      const arr = rawArr.map(ele=>ele.innerHTML)
      data.push(arr)
    }
    let daiRs = {
      name: name,
      code: code,
      data: data
    }
    if (checkResult(daiRs.data))
    rs.push(daiRs)
  });
  return rs
}

const dateToString = (year, month, day) => {
  return year + '-' + month + '-' + day
}

const checkDate = (parsed, year, month, day) => {
  const lastDateString = parsed.querySelector('.ngay').toString()
  const date = day + '/' + month + '/' + year
  return lastDateString.includes(date)
}

const checkResult = (rs) => {
  if (rs.length !== 9) return false
  let sum = 0
  for (let giai = 0; giai < 9; giai ++) {
    let row = rs[giai]
    if (row.length < 1) return false
    for (let i = 0; i < row.length; i++) {
      if (isNaN(row[i])) return false
      sum++
    }
  }
  return sum===18
}

const getRawResult_MN = async (DB_result, year, month, day) => {
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
        // console.log(parsed.childNodes)
        if (!checkDate(parsed, year, month, day)) {
          console.log('result not exist')
          return null
        }
        let rs = getResult(parsed)
        if (rs) {
          console.log(rs)
          const doc = {
            dai: 'MN',
            date: dateToString(year, month, day),
            id: 'mn-' + dateToString(year, month, day),
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

export default getRawResult_MN;
