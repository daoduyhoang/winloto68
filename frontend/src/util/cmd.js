import {perm, kickPerm, kickPair} from './perm'

const error_rs = {
    sum: 0,
    returnSum: 0,
    winAmount: 0,
    rest: 0
}

function getReturnPercent(returnPercent, n) {
    switch (n) {
        case 2:
            return returnPercent.two
        case 3:
            return returnPercent.three
        case 4:
            return returnPercent.four
        default:
            return 0
    }
}

function sameDigits(numbers) {
    if (numbers.length === 0) return false
    if (numbers.length === 1) return true
    const digits = numbers[0].length
    for (let i = 1; i < numbers.length; i++) {
        if (digits !== numbers[i].length)
            return false
    }
    return true
}

function bingo(number, result) {
    if (number.length > result.length) return false
    return number === result.substr(result.length - number.length);
}

function getWinningMulti(winningMulti, n) {
    switch (n) {
        case 1:
            return winningMulti.kick
        case 2:
            return winningMulti.two
        case 3:
            return winningMulti.three
        case 4:
            return winningMulti.four
        default:
            return 0
    }
}

/*
    CORE COMMANDS
*/
function dau(dai, value, numbers, client, result) {
    if (numbers[0].length !== 2) return error_rs
    const digits = 2
    const sumMulti = dai==='mb' ? 4 : 1
    let sum = sumMulti * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        // for (let i = 0; i < 8; i++) {
            // let ele = result[0][0]
            // if (bingo(number, ele)) {
            //     // console.log('bingo', number, ele)
            //     winAmount += winningMulti
            // }
            let i = dai==='mb' ? 7 : 8 // digits == 2 ? 7 : digits == 3 ? 6 : 5
            let row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(number, ele)) {
                    console.log('bingo dau', number, ele)
                    winAmount += winningMulti
                }
            }
        // }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function duoi(dai, value, numbers, client, result) {
    if (numbers[0].length !== 2 && numbers[0].length !== 4) return error_rs
    const digits = numbers[0].length
    const sumMulti = 1
    let sum = sumMulti * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        // for (let i = 0; i < 8; i++) {
            let ele = result[0][0]
            if (bingo(number, ele)) {
                // console.log('bingo', number, ele)
                winAmount += winningMulti
            }
            // let i = digits == 2 ? 7 : digits == 3 ? 6 : 5
            // let row = result[i]
            // for (let j in row) {
            //     let ele = row[j]
            //     if (bingo(number, ele)) {
            //         console.log('bingo dauduoi', number, ele)
            //         winAmount += winningMulti
            //     }
            // }
        // }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function dauduoi(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    let sumMulti = digits == 2 ? 5 : digits == 3 ? 4 : 7
    if (dai!=='mb') {
        sumMulti = digits == 2 ? 2 : digits == 3 ? 2 : 4
    }
    let sum = sumMulti * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        // for (let i = 0; i < 8; i++) {
            let ele = result[0][0]
            if (bingo(number, ele)) {
                // console.log('bingo', number, ele)
                winAmount += winningMulti
            }
            let i = digits == 2 ? 7 : digits == 3 ? 6 : 5
            if (dai!=='mb') {
                i = digits == 2 ? 8 : digits == 3 ? 7 : 6
            }
            let row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(number, ele)) {
                    console.log('bingo dauduoi', number, ele)
                    winAmount += winningMulti
                }
            }
        // }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function baolo(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    let sumMul = digits == 2 ? 27 : digits == 3 ? 23 : 20
    if (dai!=='mb') {
        sumMul = digits == 2 ? 18 : digits == 3 ? 17 : 16
    }
    let sum = sumMul * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        let to = dai === 'mb' ? 7 : 8
        for (let i = 0; i <= to; i++) {
            let row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(number, ele)) {
                    console.log('bingo baolo', dai, number, ele)
                    winAmount += winningMulti
                }
            }
        }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function baolodao(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    let sumMul = digits == 2 ? 27 : digits == 3 ? 23 : 20
    if (dai!=='mb') {
        sumMul = digits == 2 ? 18 : digits == 3 ? 17 : 16
    }
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let winAmount = 0
    for (let numberi in numbers) {
        let number = numbers[numberi]
        let permArr = perm(number)
        sum += sumMul * permArr.length

        if (result)
        for (let permi in permArr){
            let perm = permArr[permi]
            let to = dai === 'mb' ? 7 : 8
            for (let i = 0; i <= to; i++) {
                let row = result[i]
                for (let j in row) {
                    let ele = row[j]
                    if (bingo(perm, ele)) {
                        console.log('bingo baolodao', perm, ele)
                        winAmount += winningMulti
                    }
                }
            }
        }
    }
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function dacap(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (digits !== 2 || numbers.length < 2) return error_rs
    let sumMul = 54 //digits == 2 ? 27 : digits == 3 ? 23 : 20
    if (dai!=='mb') {
        sumMul = 36
    }
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, 1)
    let bonusKick = client.bonusKick
    let winAmount = 0
    let pairs = kickPair(numbers)

    // console.log('pairs', pairs)

    if (result)
    for (let pairi in pairs) {
        let pair= pairs[pairi]
        let bingos = [0,0]
        for (let i=0; i<2; i++) {
            let number = pair[i]
            let to = dai === 'mb' ? 7 : 8
            for (let j=0; j<=to; j++) {
                let row = result[j]
                for (let k =0; k<row.length; k++) {
                    let ele = row[k]
                    if (bingo(number,ele)) {
                        bingos[i]++
                    }
                }
            }
        }
        let min = bingos[0] > bingos[1] ? bingos[1] : bingos[0]
        if (pair[0] === pair[1]) min = Math.floor(min/2)
        if (min > (1 + bonusKick)) min = 1 + bonusKick
        winAmount += min * winningMulti
    }

    sum += sumMul * pairs.length
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function da(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (digits !== 2 || numbers.length < 2) return error_rs
    let sumMul = 54 //digits == 2 ? 27 : digits == 3 ? 23 : 20 
    if (dai!=='mb') {
        sumMul = 36
    }
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, 1)
    let bonusKick = client.bonusKick
    let winAmount = 0
    let pairs = kickPerm(numbers)


    if (result)
    for (let pairi in pairs) {
        let pair= pairs[pairi]
        let bingos = [0,0]
        for (let i=0; i<2; i++) {
            let number = pair[i]
            let to = dai === 'mb' ? 7 : 8
            for (let j=0; j<=to; j++) {
                let row = result[j]
                for (let k =0; k<row.length; k++) {
                    let ele = row[k]
                    if (bingo(number,ele)) {
                        bingos[i]++
                    }
                }
            }
        }
        let min = bingos[0] > bingos[1] ? bingos[1] : bingos[0]
        if (pair[0] === pair[1]) min = Math.floor(min/2)
        if (min > (1 + bonusKick)) min = 1 + bonusKick
        winAmount += min * winningMulti
    }

    sum += sumMul * pairs.length
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function daxien(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (digits !== 2 || numbers.length < 2) return error_rs
    let sumMul = 54 //digits == 2 ? 27 : digits == 3 ? 23 : 20 
    if (dai!=='mb') {
        sumMul = 36 * 2
    }
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, 1)
    let bonusKick = client.bonusKick
    let winAmount = 0
    let pairs = kickPerm(numbers)


    if (result)
    for (let pairi in pairs) {
        let pair= pairs[pairi]
        let bingos = [0,0]
        for (let i=0; i<2; i++) {
            let number = pair[i]
            let to = dai === 'mb' ? 7 : 8
            for (let j=0; j<=to; j++) {
                let row = result[j]
                for (let k =0; k<row.length; k++) {
                    let ele = row[k]
                    if (bingo(number,ele)) {
                        bingos[i]++
                    }
                }
            }
        }
        let min = bingos[0] > bingos[1] ? bingos[1] : bingos[0]
        // CHECK, SMT WRONG
        if (pair[0] === pair[1]) min = Math.floor(min/2)
        if (min > (1 + bonusKick)) min = 1 + bonusKick
        winAmount += min * winningMulti
    }

    sum += sumMul * pairs.length
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function xiuchudau(dai, value, numbers, client, result) {
    if (numbers[0].length !== 3) return error_rs
    const digits = 3
    let sumMul = 3
    if (dai!=='mb') {
        sumMul = 1
    }
    let sum = sumMul * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        // for (let i = 0; i < 8; i++) {
            // let ele = result[0][0]
            // if (bingo(number, ele)) {
            //     // console.log('bingo', number, ele)
            //     winAmount += winningMulti
            // }
            let i = dai === 'mb' ? 6 : 7 // digits == 2 ? 7 : digits == 3 ? 6 : 5
            let row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(number, ele)) {
                    console.log('bingo xiuchudau', number, ele)
                    winAmount += winningMulti
                }
            }
        // }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function xiuchuduoi(dai, value, numbers, client, result) {
    if (numbers[0].length !== 3) return error_rs
    const digits = numbers[0].length
    const sumMul = 1
    let sum = sumMul * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        // for (let i = 0; i < 8; i++) {
            let ele = result[0][0]
            if (bingo(number, ele)) {
                console.log('bingo xiuchuduoi', number, ele)
                winAmount += winningMulti
            }
            // let i = digits == 2 ? 7 : digits == 3 ? 6 : 5
            // let row = result[i]
            // for (let j in row) {
            //     let ele = row[j]
            //     if (bingo(number, ele)) {
            //         console.log('bingo dauduoi', number, ele)
            //         winAmount += winningMulti
            //     }
            // }
        // }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function xiuchuduoidao(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (numbers[0].length !== 3) return error_rs
    let sumMul = 1 //digits == 2 ? 27 : digits == 3 ? 23 : 20
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let winAmount = 0
    for (let numberi in numbers) {
        let number = numbers[numberi]
        let permArr = perm(number)
        sum += sumMul * permArr.length

        if (result)
        for (let permi in permArr){
            let perm = permArr[permi]
            for (let i = 0; i < 1; i++) {
                let row = result[i]
                for (let j in row) {
                    let ele = row[j]
                    if (bingo(perm, ele)) {
                        console.log('bingo xiuchuduoidao', perm, ele)
                        winAmount += winningMulti
                    }
                }
            }
        }
    }
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function daudao(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (numbers[0].length !== 3) return error_rs
    let sumMul = 3 //digits == 2 ? 27 : digits == 3 ? 23 : 20
    if (dai!=='mb') {
        sumMul = 1
    }
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let winAmount = 0
    for (let numberi in numbers) {
        let number = numbers[numberi]
        let permArr = perm(number)
        sum += sumMul * permArr.length

        if (result)
        for (let permi in permArr){
            let perm = permArr[permi]

            // let row = result[0]
            // for (let j in row) {
            //     let ele = row[j]
            //     if (bingo(perm, ele)) {
            //         console.log('bingo xiuchudao', perm, ele)
            //         winAmount += winningMulti
            //     }
            // }

            let i = dai === 'mb' ? 6 : 7
            let row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(perm, ele)) {
                    console.log('bingo daudao', perm, ele)
                    winAmount += winningMulti
                }
            }
            
        }
    }
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function duoidao(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (numbers[0].length !== 4) return error_rs
    let sumMul = 1 //digits == 2 ? 27 : digits == 3 ? 23 : 20 
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let winAmount = 0
    for (let numberi in numbers) {
        let number = numbers[numberi]
        let permArr = perm(number)
        sum += sumMul * permArr.length

        if (result)
        for (let permi in permArr){
            let perm = permArr[permi]
            for (let i = 0; i < 1; i++) {
                let row = result[i]
                for (let j in row) {
                    let ele = row[j]
                    if (bingo(perm, ele)) {
                        console.log('bingo duoidao', perm, ele)
                        winAmount += winningMulti
                    }
                }
            }
        }
    }
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function xiuchu(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (digits!==3) return error_rs
    let sumMul = 4 // digits == 2 ? 5 : digits == 3 ? 4 : 7
    if (dai!=='mb') {
        sumMul = 2
    }
    let sum = sumMul * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let returnSum = sum * returnPercent / 100
    let winAmount = 0
    if (result)
    for (let numberi in numbers) {
        let number = numbers[numberi]
        // for (let i = 0; i < 8; i++) {
            let ele = result[0][0]
            if (bingo(number, ele)) {
                // console.log('bingo', number, ele)
                winAmount += winningMulti
            }
            let i = dai === 'mb' ? 6 : 7 //digits == 2 ? 7 : digits == 3 ? 6 : 5
            let row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(number, ele)) {
                    console.log('bingo xiuchu', number, ele)
                    winAmount += winningMulti
                }
            }
        // }
    }
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function xiuchudao(dai, value, numbers, client, result) {
    const digits = numbers[0].length
    if (numbers[0].length !== 3) return error_rs
    let sumMul = 4 //digits == 2 ? 27 : digits == 3 ? 23 : 20 
    if (dai!=='mb') {
        sumMul = 2
    }
    let sum = 0 //27 * numbers.length * value
    let returnPercent = getReturnPercent(client.returnPercent, digits)
    let winningMulti = getWinningMulti(client.winningMulti, digits)
    let winAmount = 0
    for (let numberi in numbers) {
        let number = numbers[numberi]
        let permArr = perm(number)
        sum += sumMul * permArr.length

        if (result)
        for (let permi in permArr){
            let perm = permArr[permi]

            let row = result[0]
            for (let j in row) {
                let ele = row[j]
                if (bingo(perm, ele)) {
                    console.log('bingo xiuchudao', perm, ele)
                    winAmount += winningMulti
                }
            }

            let i = dai === 'mb' ? 6 : 7
            row = result[i]
            for (let j in row) {
                let ele = row[j]
                if (bingo(perm, ele)) {
                    console.log('bingo xiuchudao', perm, ele)
                    winAmount += winningMulti
                }
            }
        }
    }
    sum *= value
    let returnSum = sum * returnPercent / 100
    winAmount *= value
    const rs = {
        sum: sum,
        returnSum: returnSum,
        winAmount: winAmount,
        rest: returnSum - winAmount
    }
    return rs
}

function getProcessResult(dai, cmd, numbers, client, result) {
    if (!sameDigits(numbers)) return error_rs
    const type = cmd.type
    const value = cmd.value
    switch (type) {
        case 'dau':
            return dau(dai, value, numbers, client, result)
        case 'duoi':
            return duoi(dai, value, numbers, client, result)
        case 'dauduoi':
            return dauduoi(dai, value, numbers, client, result)
        case 'baolo':
            return baolo(dai, value, numbers, client, result)
        case 'baolodao':
            return baolodao(dai, value, numbers, client, result)

        case 'dacap':
            return dacap(dai, value, numbers, client, result)
        case 'da':
            return da(dai, value, numbers, client, result)    
        case 'xiuchudau':
            return xiuchudau(dai, value, numbers, client, result)
        case 'xiuchuduoi':
            return xiuchuduoi(dai, value, numbers, client, result)
        case 'xiuchuduoidao':
            return xiuchuduoidao(dai, value, numbers, client, result)
        case 'daudao':
            return daudao(dai, value, numbers, client, result)

        case 'duoidao':
            return duoidao(dai, value, numbers, client, result)
        case 'xiuchu':
            return xiuchu(dai, value, numbers, client, result)   
        case 'xiuchudao':
            return xiuchudao(dai, value, numbers, client, result)
        default:
            return error_rs         
    }
}

export const process = (dai, cmd, numbers, client, _results) => {
    if (!sameDigits(numbers)) return error_rs
    let results
    const type = cmd.type
    const value = cmd.value
    // console.log('xxx daxien', _results)
    if (type==='daxien') {
        if (!_results){
            results = null
        } else {
            results = []
            for (let i = 0; i < 9; i++) {
                let row = _results[0][i].concat(_results[1][i])
                results.push(row)
            } 
        }
        // console.log('xxx daxien', results)
        return daxien(dai, value, numbers, client, results)
    }

    results = _results
    if (!results) {
        if (dai==='2d') {
            results=[null, null]
        } else {
            results=[null]
        }
    }

    if (dai !== '2d') return getProcessResult(dai, cmd, numbers, client, results[0])

    const rs1 = getProcessResult(dai, cmd, numbers, client, results[0])
    const rs2 = getProcessResult(dai, cmd, numbers, client, results[1])
    const rs = {
        sum: rs1.sum + rs2.sum,
        returnSum: rs1.returnSum + rs2.returnSum,
        winAmount: rs1.winAmount + rs2.winAmount,
        rest: rs1.returnSum - rs1.winAmount + rs2.returnSum - rs2.winAmount
    }
    return rs
    
    /* switch (type) {
        case 'dau':
            return dau(dai, value, numbers, client, result)
        case 'duoi':
            return duoi(dai, value, numbers, client, result)
        case 'dauduoi':
            return dauduoi(dai, value, numbers, client, result)
        case 'baolo':
            return baolo(dai, value, numbers, client, result)
        case 'baolodao':
            return baolodao(dai, value, numbers, client, result)

        case 'dacap':
            return dacap(dai, value, numbers, client, result)
        case 'da':
            return da(dai, value, numbers, client, result)    
        case 'xiuchudau':
            return xiuchudau(dai, value, numbers, client, result)
        case 'xiuchuduoi':
            return xiuchuduoi(dai, value, numbers, client, result)
        case 'xiuchuduoidao':
            return xiuchuduoidao(dai, value, numbers, client, result)
        case 'daudao':
            return daudao(dai, value, numbers, client, result)

        case 'duoidao':
            return duoidao(dai, value, numbers, client, result)
        case 'xiuchu':
            return xiuchu(dai, value, numbers, client, result)   
        case 'xiuchudao':
            return xiuchudao(dai, value, numbers, client, result)
        default:
            return error_rs         
    } */
}