
const development={
    name:'development',
    session_cookie_secret_key:'ItIsAKeyToEncrptAndDecrypt',
    db_name:'sociam_development',
    jwt_secret_key:'sociam_arp',
}

const production = {
    name: process.env.SOCIAM_ENVIRONMENT,
    session_cookie_secret_key: process.env.SOCIAM_SESSION_COOKIE_SECRET_KEY,
    db_name: process.env.SOCIAM_DB_NAME,
    jwt_secret_key: process.env.SOCIAM_JWT_SECRET_KEY,
}

// module.exports= process.env.SOCIAM_ENVIRONMENT || development;
// module.exports=eval(process.env.SOCIAM_ENVIRONMENT)==undefined?development:eval(process.env.SOCIAM_ENVIRONMENT);  
module.exports= development;