function permWithDup(xs) {
    let ret = [];
  
    for (let i = 0; i < xs.length; i = i + 1) {
      let rest = permWithDup(xs.slice(0, i).concat(xs.slice(i + 1)));
  
      if(!rest.length) {
        ret.push([xs[i]])
      } else {
        for(let j = 0; j < rest.length; j = j + 1) {
          ret.push([xs[i]].concat(rest[j]))
        }
      }
    }
    return ret;
}

export const perm = (xs) => {
    let arr = permWithDup(xs)
    let rs = []
    for (let i = 0; i < arr.length; i++ ) {
        let ele = arr[i]
        let s = ''
        for (let j = 0; j < ele.length; j++) {
            s = s + ele[j]
        }
        if (!rs.includes(s)) {
            rs.push(s)
        }
    }
    return rs
}

export const kickPerm = (numbers) => {
  let rs = []
  if (numbers.length === 2) return [[numbers[0], numbers[1]]]
  for (let i = 0; i < numbers.length -1; i++)
    for (let j = i+1; j<numbers.length; j++) {
      if (!rs.includes([numbers[i], numbers[j]]) || !rs.includes([numbers[j], numbers[i]])) {
        rs.push([numbers[i], numbers[j]])
      }  
    }
  return rs
}

export const kickPair = (numbers) => {
  let rs = []
  if (numbers.length < 2) return rs
  for (let i = 0; i < numbers.length / 2 ; i++) {
    rs.push([numbers[i*2], numbers[i*2 + 1]])
  }
  return rs
}

export const getKeoArray = (from, to) => {
  if (from.length !== to.length) return []
  if (Number(from) > Number(to)) return []
  let rs = []
  for (let inc = 1; inc <= 9; inc++) {
    let s = ''
    for(let i = 0; i < from.length; i++) {
      if (from[i] === to[i]) {
        s += from[i]
      } else {
        if (Number(from[i]) + inc > Number(to[i])) return rs
        s+=Number(from[i]) + inc
      }
    }
    rs.push(s)
  }
  return rs
}
 