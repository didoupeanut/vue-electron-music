// 关注TA的人(粉丝)

export default (query, request) => {
    const data = {
        userId: query.uid,
        limit: query.limit || 30,
        offset: query.offset || 0
    }
    return request(
        'POST', `https://music.163.com/weapi/user/getfolloweds`, data,
        {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
}