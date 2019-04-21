// 最新MV

export default (query, request) => {
    const data = {
        // 'offset': query.offset || 0,
        limit: query.limit || 30,
        total: true
    }
    return request(
        'POST', `https://music.163.com/weapi/mv/first`, data,
        {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
}