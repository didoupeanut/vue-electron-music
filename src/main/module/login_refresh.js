// 登录刷新

export default (query, request) => {
    return request(
        'POST', `https://music.163.com/weapi/login/token/refresh`, {},
        {crypto: 'weapi', ua: 'pc', cookie: query.cookie, proxy: query.proxy}
    )
}