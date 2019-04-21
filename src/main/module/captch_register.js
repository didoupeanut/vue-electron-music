// 注册账号
import { createHash } from 'crypto';

export default (query, request) => {
  const data = {
    captcha: query.captcha,
    phone: query.phone,
    password: createHash('md5').update(query.password).digest('hex'),
    nickname: query.nickname
  }
  return request(
    'POST',
    `https://music.163.com/weapi/register/cellphone`,
    data,
    { crypto: 'weapi', cookie: query.cookie, proxy: query.proxy }
  )
}