export default {
  /**
   * true 或者 1 或者 '1' 为真，否则为假
   * @param {any} val 
   */
  toBoolean(val) {
    if (val === '') return val
    return val === 'true' || val == '1'
  }
}
