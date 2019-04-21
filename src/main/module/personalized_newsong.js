// 推荐新歌

export default (query, request) => {
    const data = {
        type: "recommend"
    }
    return request(
        'POST', `https://music.163.com/weapi/personalized/newsong`, data,
        {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
}