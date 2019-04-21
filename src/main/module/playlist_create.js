// 创建歌单

export default (query, request) => {
    query.cookie.os = 'pc'
    const data = {
        name: query.name
    }
    return request(
        'POST', `https://music.163.com/weapi/playlist/create`, data,
        {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
}