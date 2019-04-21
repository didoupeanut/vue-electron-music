// 首页轮播图

export default (query, request) => {
    return request(
        'POST', `https://music.163.com/api/v2/banner/get`, {clientType: "pc"},
        {crypto: 'linuxapi', proxy: query.proxy}
    )
}