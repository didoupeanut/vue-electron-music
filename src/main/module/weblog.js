// 操作记录

export default (query, request) => {
    return request(
        'POST', `https://music.163.com/weapi/feedback/weblog`, {},
        {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
}