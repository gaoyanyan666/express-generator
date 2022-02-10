const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req,callback)=> {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions ={origin: true};//判断whitelist是否包含origin,true 则接受访问
    }else{
        corsOptions = {origin: false};
    }
    callback(null,corsOptions);//null表示无err
};
exports.cors=cors();//turn a middleware function to check if the whitelist include access control allow origin
exports.corsWithOptions = cors(corsOptionsDelegate);