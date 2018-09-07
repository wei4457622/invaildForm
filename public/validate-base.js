// 通用型的驗證
$(() => {
  var status = {};
  var $submit = $(':submit');
  // 需要驗證的地方
  var $valid = $('[data-valid]');
  // input是一發生改變時就觸發(較新的技術)
  $valid.not($submit).on('input',{f () {
    var $this = $(this);
    // 取得input的name，ex:checkEmail
    var checkName = `check${$this.attr('name')}`;
    // 回傳true或false
    var result = universal[checkName]($this.val());
    $this[`${result ? 'remove' : 'add'}Class`]('warn');
    status[checkName] = result;
    // 把所有的屬性取出來 = checkName

    // submit的判斷條件
    var ary = Object.keys(status);
    // every() 方法會測試陣列中的所有元素是否都通過了由給定之函式所實作的測試。true or false
    $submit[`${$valid.length === ary.length && ary.map(key => status[key]).every(val => val) ? 'remove' : 'add'}Class`]('warn');
  }}.f)
  // stopImmediatePropagation 除了停止事件繼續捕捉或冒泡傳遞外，也阻止事件被傳入同元素中註冊的其它相同事件類型之監聽器。
  $('form').submit(e => {
    $submit.hasClass('warn') && (e.stopImmediatePropagation || e.preventDefault());
  });
});