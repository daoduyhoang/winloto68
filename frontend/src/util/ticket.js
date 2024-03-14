import {searchKey} from './dictionary'
import {process} from './cmd'
import {getKeoArray} from './perm'
// let input
// input = 'Mb    17    71 b20n đđ60n. 217 đlô10n đxc50n. 562 b5n xc20n đxc2n. 62   b10n. 23 24 32 33 91 81 75 73 68 17 b5n. 135 173 155 đxc2n. 581 681 733 833 933 xc2n. 532 332 673 xc3n. 21 79 dá3n.   '
// input = '79 97 da 3n...28 68 86 da v 3n, blo 5n';
// input = '19,39,59,23,43,da v 5n, b10 n...' 
// input = '019,839,569 X 50n, xd 10n...'
// input = '403 b 2n , X 50n, xd 5n'
// input = '27 96 da 2n...15 47 da 6n...'
// input = '15 19 da 5n...'
// input = '279 X 10n , b 1n'
// input = '79 97 da 3n...28 68 86 da v 3n, blo 5n'
// input = '68 86 đá 10n, bl 30n...'
// input = '386 bd 5n, xd 10n, x 50n...'
// input = '733 773 xd 10n, x 50n...'
// input = 'Mb. 32.87.23 da  5n. 32 . 23 b20n. 39 b10n.39.93da2.463xc 10n.80 b70n dd 100n. 86.65  da 2n. 48.52.69 da1   63.68.95 da1  68.95.50  da 1n.07 b10n. 07.80  da 5n.980 xc 10n.973 xc 10n.968 xc 5n.480,473,468 xc10n.73 bl 30n dd30n.68 bl 50n dd 30n. 80.68.73  da 10n.'

var trung

function insertSpace(input) {
    let s = input
    let i=0
    let l=s.length
    while (i<l-1) {
        if (!isNaN(s[i]) && s[i+1]!=" " && isNaN(s[i+1])) {
            s = [s.slice(0, i+1), ' ', s.slice(i+1)].join('')
            l++
            i++
        }
        i++
    }
    return s
}

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/á|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
}

function remove_double_spaces(input) {
    var str = input
    str = str.replace(/ +(?= )/g,'');
    return str.trim()
}

function remove_unsupported_chars(input) {
    var str = input
    str = str.replace(/n/g, " ")
    str = str.replace(/[^a-zA-Z0-9 ]/g, " ")
    return str
}

// function getDAI(input) {
//     const DAIS = ['mb','hn']
//     let DAI = 'mb'
//     let formated = input
//     DAIS.forEach((_DAI) => {
//         let tmp = formated.replace(_DAI, '')
//         if (tmp !== formated) {
//             formated = tmp
//             DAI = _DAI
//         }
//     })
//     return {DAI: DAI, formated: formated}
// }

function isValidCmd(cmd) {
    const l = cmd.length
    // first char is not number and last char is number
    return isNaN(cmd[0]) && !isNaN(cmd[l-1])
}

function formatCmd(cmd) {
    let l = cmd.length
    let pos= 0;
    while (isNaN(cmd[pos + 1]) || pos === l) pos++
    // 0..pos = type, pos + 1 .. l-1 = value
    const type = cmd.substr(0, pos + 1)
    const value = cmd.substr(pos + 1)
    if (isNaN(value)) return null
    const rs = {
        type: searchKey(type),
        value: Number(value)
    }
    // console.log(rs)
    return rs
}

function splitSubTickets(input) {
    var arr = input.split(' ')
    var rs = []
    var currCmds = []
    var currNumbers = []
    var lastEleIsNumber = true
    let i = 0
    while (i < arr.length) {
        let ele = arr[i]
        let isNumber = !isNaN(ele)
        if (isNumber) {
            if (lastEleIsNumber) {
                // numbers importing
                currNumbers.push(ele)
            } else {
                // new subTicket started
                // save to rs
                rs.push({
                    numbers: currNumbers,
                    cmds: currCmds
                })
                // reinit curr arrays
                currNumbers = [ele]
                currCmds = []
                lastEleIsNumber = true
            }
        } else {
            if (ele === 'keo' || ele === 'k') {
                // push numbers and  i++
                if (isNaN(arr[i+1])) return null
                let keoArr = getKeoArray(arr[i-1], arr[i+1])
                if (keoArr.length > 0) i++
                let j = 0
                while (j < keoArr.length) {
                    currNumbers.push(keoArr[j])
                    j++
                }

            } else {
                while(!isValidCmd(ele) && (i + 1 <arr.length)) {
                    i++
                    ele = ele + arr[i]
                }
                if (!isValidCmd(ele)) return null
                if (lastEleIsNumber) {
                    // commands of current subTicket started
                    currCmds= [formatCmd(ele)]
                    lastEleIsNumber = false
                } else {
                    // commands importing
                    currCmds.push(formatCmd(ele))
                } 
            }
        }
        i++
    }
    // push last subTicket
    rs.push({
        numbers: currNumbers,
        cmds: currCmds
    })
    return rs
}

export const format = (_input) => {
    var input = _input.toLowerCase()
    // const rs = getDAI(input)
    // const DAI = rs.DAI
    // input = rs.formated
    input = remove_unsupported_chars(input)
    input = change_alias(input)
    input = insertSpace(input)
    input = remove_double_spaces(input)
    // TODO handle keo
    input = splitSubTickets(input)
    return input
    // return {
    //     DAI: DAI,
    //     subTickets: input
    // }
}

// const output = format(input)
// console.log('DAI', output.DAI)
// console.log('Sub Tickets', output.subTickets)

/*
    CALCULATING FUNCTIONS
*/

function getDetailsByCmd(dai, cmd, numbers, client, result) {

    const rs = process(dai, cmd, numbers, client, result)
    if (!rs.sum) {
        console.log('XXXXX smt wrong', cmd, numbers)
    }

    // console.log(dai, cmd, numbers, rs)

    return rs
}

export const initDetailByType = () => {
    let rs = []
    for (let i = 0; i < 5; i++) rs.push({
        sum: 0,
        returnSum: 0,
        winAmount: 0,
        rest: 0
    })
    return rs
}

function getDetailsBySubTicket(dai, subTicket, client, result) {
    let sum = 0
    let returnSum = 0 // = sum * returnPercent
    let winAmount = 0
    const numbers = subTicket.numbers
    const cmds = subTicket.cmds

    let detailByType = initDetailByType()

    for (let i = 0; i < cmds.length; i++) {
        let cmd = cmds[i]
        let detail = getDetailsByCmd(dai, cmd, numbers, client, result)
        
        sum += detail.sum
        returnSum += detail.returnSum
        winAmount += detail.winAmount
        let type = cmd ? cmd.type : null
        if (type ==='da' || type ==='dacap') { 
            detailByType[1].sum += detail.sum
            detailByType[1].returnSum += detail.returnSum
            detailByType[1].winAmount += detail.winAmount
        } else {
            if (numbers.length > 0) {
                let digit = numbers[0].length
                detailByType[digit].sum += detail.sum
                detailByType[digit].returnSum += detail.returnSum
                detailByType[digit].winAmount += detail.winAmount
            }
        }
    }

    const details = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount,
        detailByType: detailByType
    }
    return details
}

export const getDetails = (dai, subTickets, client, result) => {
    // const subTickets = ticket.subTickets
    trung = []
    let sum = 0
    let returnSum = 0 // = sum * returnPercent
    let winAmount = 0
    let errors = []
    let logs = []
    // console.log('xxx',subTickets)
    let detailByType = initDetailByType()
    if (subTickets && subTickets.length !== 0) {
        subTickets.forEach((subTicket) => {
            let detail = getDetailsBySubTicket(dai, subTicket, client, result)
            logs.push({
                dai: dai,
                subTicket: subTicket,
                detail: detail
            })
            sum += detail.sum
            returnSum += detail.returnSum
            winAmount += detail.winAmount

            for (let i = 0; i < 5; i++) {
                detailByType[i].sum += (detail.detailByType)[i].sum
                detailByType[i].returnSum += (detail.detailByType)[i].returnSum
                detailByType[i].winAmount += (detail.detailByType)[i].winAmount
            }
            if (detail.sum === 0) {
                errors.push(subTicket)
            }
        })
    }
    const details = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount,
        errors: errors,
        logs: logs,
        detailByType: detailByType
    }
    return details
}

export const cutDai = (_s) => {
    const DAIS = ['mb','2d', 'dc', 'dp', 'tp', 'bt', 'dn', 'tn', 'vl', 'tg', 'dt', 'vt', 'ct', 'ag', 'sb', 'la', 'kg', 'cm', 'bal', 'st', 'tv', 'bp', 'dl' ]
    let input = _s
    input = change_alias(input)
    input = input.toLowerCase()
    input = input.replace(/eo|/g,"");
    input = input.replace("k"," k ");
    input = input.replace(/[^a-zA-Z0-9 ]/g, " ")
    // input = insertSpace(input)
    input = remove_double_spaces(input)
    input = input.replace(/daichanh|daichinh|dchanh|dchinh/g,"dc");
    input = input.replace(/daiphu|dphu/g,"dp");
    input = input.replace(/2dai/g,"2d"); 
    input = input.replace(/hn/g,"mb"); 
    input = input.trim()
    const arr = input.split(' ')
    let currentDAI = 'mb'
    let cursor = 0
    let text = ''
    let rs = []
    if (DAIS.includes(arr[0])) {currentDAI = arr[0]; cursor=1}
    while (cursor < arr.length) {
        if (DAIS.includes(arr[cursor])) {
            rs.push({DAI: currentDAI, input: text})
            currentDAI = arr[cursor]
            text= ''
        } else {
            text = text + ' ' + arr[cursor]
        }
        cursor++
    }
    rs.push({DAI: currentDAI, input: text})
    return rs
  }

//cutDai('Hn 67,83,68 da 9n,364x40n,352 x20n,739x20n')