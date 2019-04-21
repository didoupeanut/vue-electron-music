// 所有榜单介绍

export default (query, request) => {
    return request(
        'POST', `https://music.163.com/weapi/toplist`, {},
        {crypto: 'linuxapi', cookie: query.cookie, proxy: query.proxy}
    )
}