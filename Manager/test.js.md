const fetch = require('node-fetch');
const axios = require('axios');

const fetchIp = async () => {
    fetch("https://www.itemsatis.com/api/getProfileDatas", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,tr;q=0.8,tr-TR;q=0.7",
          "access-control-allow-headers": "Content-Type, Authorization, X-Requested-With",
          "access-control-allow-methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "access-control-allow-origin": "*",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "Referer": "https://mobile.itemsatis.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "Id=38333&token=IyLQm+Vz2wO6RH/l9mM8cmRhb4A3qqQ6Iv3H1VOsNTy0ZH8ST1lPsyr5PVG577LSNGuXTJ4XHEmh/I9x2q2U7yyoUUNplyhERiSvXFYfHB4p87gCvwtGhH+DJpI1Zei1foh0mIrJQsrOok6F1kbcJQ==",        "method": "POST"
      }).then(async (res) => console.log(await res.json()))
}
fetchIp()
/*const fetchInfo = async () => {
    try {
    let info = await axios({
        method: 'post',
        url: 'https://discord.com/api/v10/auth/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            email: username,
            password: password
        }
    });
        console.log("Response: ", info.data)
    } catch(error) {
        console.log("Error: ", error.response.statusText)
    }
}*/

//fetchInfo()