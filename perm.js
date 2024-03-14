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

function perm(xs) {
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
 