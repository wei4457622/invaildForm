$(() => {
  $('[data-toggle="tooltip"]').each({f () {
    var showHide = $el => {
      $el.tooltip($el.hasClass('warn') ? 'show' : 'hide');
    }
    // 檢查attr被修改時就通知我
    // attributes characterData childList一定要設定
    var $this = $(this);
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.attributeName === 'class' && showHide($this);
      })
    }).observe(this, {attributes: true, characterData: false, childList: false})
    // bootstrap的tooltip設定
    $this.tooltip( {placement: 'right', trigger: 'manual'});
    showHide($this);
  }}.f)
  $('[data-from][data-to]').each({f () {
    var $this = $(this);
    var i = $this.data('from');
    // 動態產生所有的年份
    do {
      $this.append(`<option value="${i}">${i}</option>`)
    } while (i++ < $this.data('to'))
  }}.f)
  var $city = $('.city');
  var $region = $('.region');
  $city.length && $region.length && $.getJSON('data.json', data => {
    // 第一個值為值，第二個值為索引
    data.city.forEach((a, i) => {
      $city.append(`<option value="${i}">${a}</option>`);
    })
    // 當city change時
    $city.change(() => {
      // 清空region
      $region.empty();
      // 以抓到當下city的索引，並跑過每一個
      data.region[$city.val()].forEach((a, i) => {
        $region.append(`<option value="${i}">${a}</option>`);
      });
    })
  })
});