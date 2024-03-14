const Btc = require('bitcoinjs-lib')
// mgCS9r77VNUpHzmYYpYqsde8trGuPAJ9U2
async function sendRawTx(_network, _tx_hex) {
    let url = 'https://chain.so/api/v2/send_tx/'+ _network
    let qs= {
        tx_hex: _tx_hex
    }

    let rs = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(qs),
    headers:{
        'Content-Type': 'application/json'
        }
        }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
}

// async function get_tx_received(_network, _address) {
//     let url = 'https://chain.so/api/v2/get_tx_received/'+ _network +'/' + _address
//     const requestOptions = {
//     method: 'GET',
//     uri: url,
//     qs: {
//     },
//     json: true,
//     };
//     let rs = await rp(requestOptions)
//     if (!rs) return []
//     let txs = rs.data.txs
//     return txs
// }

async function getSpentTxs(_network, _address) {
    let url = 'https://chain.so/api/v2/get_tx_spent/'+ _network +'/' + _address
    // console.log(url)
    let qs= {
    }

    let rs = await fetch(url);
    let data = await rs.json()
      //console.log(data)
    return data.data.txs
}

async function getLastSpentTx(_network, _address) {
    let txs = await getSpentTxs(_network, _address)
    let l = txs.length
    if (l===0) return null
    let tx = txs[l-1]
    // console.log(tx)
    return tx
}

async function getUnspentTxs(_network, _address) {
    //let lastSpentTx = await getLastSpentTx(_network, _address)
    let url = 'https://chain.so/api/v2/get_tx_unspent/'+ _network +'/' + _address
    //if (lastSpentTx) url = url + '/' + lastSpentTx.txid
    // console.log(url)
    let qs= {
    }

    let rs = await fetch(url);
    let data = await rs.json()
      //console.log(data)
    return data.data.txs
}

export async function transfer(wifKey, network, apiSymbol, toTransfer, toAddress){
    // console.log('toTransfer', toTransfer)
    const TestNet = Btc.networks.testnet
    let buildingTx = new Btc.TransactionBuilder(network)
    let ourWallet = new Btc.ECPair.fromWIF(wifKey, network)
    const { address } = Btc.payments.p2pkh({ pubkey: ourWallet.publicKey, network: network })
    // bytes = 180in + 34 out +10 + in
    let price = 10
    let txs = await getUnspentTxs(apiSymbol, address)
    let sum = 0
    let count = txs.length
    // console.log('total unspent txs', count)
    let fee = 34 * 2 + 10
    let vin= 0
    for (let tx of txs) {
        fee += 181
        let txid = await tx.txid
        buildingTx.addInput(txid, tx.output_no)
        sum += Number(tx.value) * 1e8
        // console.log(sum)
        if (sum > Number(fee) + Number(toTransfer)) {
            buildingTx.addOutput(toAddress, Number(toTransfer))
            let rest = ((sum - fee - toTransfer))
            buildingTx.addOutput(address, Number(rest))
            for (let i = 0; i <= vin; i++) {
                buildingTx.sign(i, ourWallet)
            }
            let tx_hex = buildingTx.build().toHex()
            // console.log(tx_hex)
            // console.log(vin, sum)
            await sendRawTx(apiSymbol, tx_hex)
            break;
        }
        vin++
    }
    // console.log(sum, ' BTC')
}
