// 云盘数据

export default (query, request) => {
    const data = {
        limit: query.limit || 200,
        offset: query.offset || 0
    }
    return request(
        'POST', `https://music.163.com/weapi/v1/cloud/get`, data,
        {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
}