const { default: axios } = require("axios");


exports.send_whatsapp = async(no_telp, req_id, msg) => {
    console.log('=============== send_whatsapp ===============');
    console.log(no_telp);

    if(no_telp[0] == '0'){
        arr_no_telp = no_telp.split('');
        arr_no_telp.splice(0,1);
        arr_no_telp.unshift('6','2')
        console.log(arr_no_telp);
        no_telp = arr_no_telp.join('')
    }

    try {
        const url_base = `https://testi.transfinance.id/send-message?api_key=TFj@y@654321&sender=6287716598524&number=${no_telp}&message=${msg}`
        console.log(url_base);
        // const url = `${url_base}https://approval.transfinance.id/request-dtl?id=${req_id}`;
    
        console.log(url_base);
    
        const response = await axios({
            method: 'get',
            url: url_base,
        });
    
        console.log(response.data.code);
    } catch (error) {
        console.error(error)
        console.error(error.status);
        console.error(error.code);
    }
}