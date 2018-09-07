// 兼容前後端的JS檔案
// IIFE
(obj => {
  // this就是全域
  // 如果吻合就把obj丟給module.exports
  typeof module === 'object' && module.exports ? module.exports = obj : this[obj.name] = obj;
})({
  name: 'universal',
  // 用正規表達式做mail驗證
  // .任何符號 \.只有點符號
  // test() 方法执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false
  checkEmail: val => /.+@.+\..+/.test(val),
  // 因為this關係所以這邊用function簡寫
  checkPassword (val) {
    return /.{8,}/.test(this._password = val);
  },
  checkConfirmPassword(val) {
    return this._password === val;
  },
  // 開頭是09，後八碼是任一數值
  checkPhone: val => /^09\d{8}/.test(val),
  // 必須要有任一中文字
  checkAddress: val => /[\u4e00-\u9fa5]/.test(val),
  checkImage: ary => ary.length <= 3 && ary.every(file => file.width <= 150 ||file.height <= 150),
  // 判別卡號
  checkCardNumber(val) {
    val = val.replace(/\s/g, '')
    return (/^4[0-9]{12}(?:[0-9]{3})?$/.test(val) && 'visa') ||
      (/^5[1-5][0-9]{14}$/.test(val) && 'master') || ''
  }
});