const https = require('https');
const data = JSON.stringify({model:"kimi-k2.6",messages:[{role:"user",content:"hello"}],web_search:true});
const req = https.request({hostname:'api.moonshot.cn',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer sk-laBSgNkqWO5VQO3U1MpHljlA0pAktBpaoWCKFK9woQKj9FlG','Content-Length':data.length}}, res => {let d='';res.on('data',c=>d+=c);res.on('end',()=>console.log(d,res.statusCode))});
req.write(data);req.end();
