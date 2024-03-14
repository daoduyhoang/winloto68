import {constant} from '../constant'
import {getRawResult_MB, getRawResult_MN, getTime} from '../utility';

const dateToString = (year, month, day) => {
    return year + '-' + month + '-' + day
  }

export class Automat{
    public db: any
    public DB_Result: any

    constructor(_db){
        this.DB_Result = _db.getModel('Result')

    }

    private async MB_initLoop(i) {
        const self = this
        if (i === 7) return
        setTimeout(async function() {
            const time = getTime(i)
            console.log(i, time)
            const loadedResult = await getRawResult_MB(self.DB_Result, time.year, time.month, time.day)
            self.MB_initLoop(i+1)
        }, 1000)
    }

    private async MN_initLoop(i) {
        const self = this
        if (i === 7) return
        setTimeout(async function() {
            const time = getTime(i)
            console.log(i, time)
            const loadedResult = await getRawResult_MN(self.DB_Result, time.year, time.month, time.day)
            self.MN_initLoop(i+1)
        }, 1000)
    }

    public async start() {
        const self = this
        await this.MB_initLoop(0)
        await this.MN_initLoop(0)
        setInterval(async function(){
            const time = getTime(0)

            if (time.hour >= 18 && time.min > 30) {
                const resultId_MB = 'mb-'+dateToString(time.year,time.month,time.day)
                const result = await self.DB_Result.findOne({id: resultId_MB})
                if (!result) {
                    const loadedResult = await getRawResult_MB(self.DB_Result, time.year, time.month, time.day)
                } else {
                    console.log('already loaded')
                }  
            } else {
                console.log('not time to load result')
            }

            if (time.hour >= 16 && time.min > 35) {
                const resultId_MN = 'mn-'+dateToString(time.year,time.month,time.day)
                const result = await self.DB_Result.findOne({id: resultId_MN})
                if (!result) {
                    const loadedResult = await getRawResult_MN(self.DB_Result, time.year, time.month, time.day)
                } else {
                    console.log('already loaded')
                }  
            } else {
                console.log('not time to load result')
            }


        }, 30000)
    }
}
