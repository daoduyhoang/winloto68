let input
// input = 'Mb    17    71 b20n đđ60n. 217 đlô10n đxc50n. 562 b5n xc20n đxc2n. 62   b10n. 23 24 32 33 91 81 75 73 68 17 b5n. 135 173 155 đxc2n. 581 681 733 833 933 xc2n. 532 332 673 xc3n. 21 79 dá3n.   '
// input = '79 97 da 3n...28 68 86 da v 3n, blo 5n';
input = '19,39,59,23,43,da v 5n, b10 n...' 
// input = '019,839,569 X 50n, xd 10n...'
// input = '403 b 2n , X 50n, xd 5n'
// input = '27 96 da 2n...15 47 da 6n...'
// input = '15 19 da 5n...'
// input = '279 X 10n , b 1n'
// input = '79 97 da 3n...28 68 86 da v 3n, blo 5n'
// input = '68 86 đá 10n, bl 30n...'
// input = '386 bd 5n, xd 10n, x 50n...'
// input = '733 773 xd 10n, x 50n...'

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/á|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|o/g,""); 
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
    str = str.replace(/n/g, "")
    return str
}

function getDAI(input) {
    const DAIS = ['mb']
    let DAI = 'mb'
    let formated = input
    DAIS.forEach((_DAI) => {
        let tmp = formated.replace(_DAI, '')
        if (tmp !== formated) {
            formated = tmp
            DAI = _DAI
        }
    })
    return {DAI: DAI, formated: formated}
}

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
        type: type,
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
                currNumbers.push(Number(ele))
            } else {
                // new subTicket started
                // save to rs
                rs.push({
                    numbers: currNumbers,
                    cmds: currCmds
                })
                // reinit curr arrays
                currNumbers = [Number(ele)]
                currCmds = []
                lastEleIsNumber = true
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
        i++
    }
    // push last subTicket
    rs.push({
        numbers: currNumbers,
        cmds: currCmds
    })
    return rs
}

function format(_input) {
    var input = _input.toLowerCase()
    const rs = getDAI(input)
    const DAI = rs.DAI
    input = rs.formated
    input = change_alias(input)
    input = remove_unsupported_chars(input)
    input = remove_double_spaces(input)
    input = splitSubTickets(input)
    return {
        DAI: DAI,
        subTickets: input
    }
}

const output = format(input)
console.log('DAI', output.DAI)
console.log('Sub Tickets', output.subTickets)