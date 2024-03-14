/*
//String instead of number type

[ [ 15102 ], // duoi, giai db
  [ 84936 ],
  [ 63579, 17598 ],
  [ 7421, 62597, 13439, 98428, 44390, 54471 ], //07421
  [ 3310, 5387, 6682, 8876 ],
  [ 7551, 3606, 225, 1113, 7107, 7167 ], // 0225
  [ 992, 412, 445 ],
  [ 63, 84, 94, 22 ] ] // dau, giai 7
*/
const types = [
    {   //V
        key: 'dau', // vidu danh 01 1n => tong = 4 n, , win = if in giai 7, multi //  2 chu so V
        alias: ['dau']
    },
    {   //V
        key: 'duoi', // vidu danh 01 1n => tong = 1,1n , win = if in giai db //  2,4 chu so V
        alias: ['duoi', 'dui', 'di']
    },
    {   //V
        key: 'dauduoi', // vidu danh 01 1n => tong = 5,4,7n , win = if in giai 7 or giai db, multi //  2,3,4 chu so V
        alias: ['dauduoi', 'daudui', 'daduoi','duduoi','dadui','dudui','dd']
    },
    {   //V
        key: 'baolo', //vidu danh 01 1n => tong = 27n,23,20 , win = if in any, multi//  2,3,4 chu so V
        alias: ['b','baolo','balo', 'blo', 'bolo','baol','bl','bao']
    },
    {   //V
        key: 'baolodao', //vidu danh 123 => N<=6(123,213...)  hoan vi loai trung 1n => tong = 23* N n, 20 N n , win = if in any, multi//  3,4 chu so
        alias: ['baolodao','balodao', 'blodao', 'bolodao','baoldao','bldao','bdao','baodao','dlo', 'bd']
    },

    // {
    //     // ???
    //     key: 'dacap', // vidu danh 01 02(thang), 01 02 03 (vong) to hop C(2,n)  1n => tong = 54  * C n, , win = if in all , multi limit = thuongda + 1//  2 chu so, 
    //     alias: ['dacap','dacp','daca','dcap','daap']
    // },

    {
        // ???
        key: 'daxien', // vidu danh 01 02(thang), 01 02 03 (vong) to hop C(2,n)  1n => tong = 54  * C n, , win = if in all , multi limit = thuongda + 1//  2 chu so, 
        alias: ['daxien','dx','daxin','daxen','dxien']
    },

    {
        // ???
        key: 'da', // vidu danh 01 02(thang), 01 02 03 (vong) to hop C(2,n)  1n => tong = 54  * C n, , win = if in all , multi limit = thuongda + 1//  2 chu so, 
        alias: ['davong','dav','dathang','dathan','dathag', 'da', 'dat','dv', 'dvog', 'dacap','dacp','daca','dcap','daap']
    },
    {   //V
        key: 'xiuchudau', // vidu danh 01 1n => tong = 3 n, , win = if in giai 6 , multi //  3 chu so
        alias: ['xiuchudau', 'xuichudau', 'xichudau','xcdau','tldau','xchudau','xdau','xchudau','xichdau','xuchudau']
    },
    {   //V
        key: 'xiuchuduoi',// vidu danh 01 1n => tong = 1 n, , win = if in giai db  //  3 chu so
        alias:  [
                'xiuchuduoi', 'xuichuduoi', 'xichuduoi','xcduoi','tlduoi','xchuduoi','xduoi','xchuduoi','xichduoi','xuchuduoi',
                'xiuchudui', 'xuichudui', 'xichudui','xcdui','tldui','xchudui','xdui','xchudui','xichdui','xuchudui',
                ]
    },
    {   //V
        key: 'xiuchuduoidao', // vidu danh 444 N = 4!, hoan vi loai trung 1n => tong = 3 * N n, , win = if in giai 6  // 3 chu so
        alias: ['xcduidao','xduidao','xchuduidao','xiuchuduidao','tlduidao','tlduoida']
    },
    {   //V
        key: 'daudao', // vidu danh 123 N = 6,3,1 1n hoan vi loai trung => tong = 3 * N n, , win = if in giai 6  //  3 chu so
        alias: ['xcdaudao','xdaudao','xchudaudao','xiuchudaudao','tldaudao','daudao','daodau','daudo','dadao']
    },
    {   //V
        key: 'duoidao', // vidu danh 4444 N = 4!, hoan vi loai trung 1n => tong = 3 * N n, , win = if in giai 5  // 4 chu so
        alias: ['duoidao','duidao','duoido','doidao']
    },
    {   //V
        key: 'xiuchu' , // vidu danh 123 1n => tong = 4  n, , win = if in giai 6 + db //  3 chu so
        alias: ['xchu','xiuchu','xc','tl','x']
    },
    {   //V
        key: 'xiuchudao', // vidu danh 123 1n N = hoan vi loai trung => tong = 4 * N  n, , win = if in giai 6 + db //  3 chu so
        alias: ['xd', 'xcdao','xdao','xichudao','xchudao','xiuchudao','xuichudao','tldao','xuchudao','dxc']
    },
]

export const searchKey = (text) => {
    // console.log('xxx search ', text)
    const l = types.length
    let i = 0
    while (i < l){
        let type = types[i]
        const alias = type.alias
        // console.log('alias', alias)
        if (alias.includes(text)) {
            return type.key
        }
        i++
    }
    console.log('NOT FOUND', text)
    return null
}