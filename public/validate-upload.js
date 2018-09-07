$(() => {
  var $img = $('.img')
  var $msg = $('.msg')
  var $form = $('form')
  var addedFile = []
  var showImage = list => {
    $img.find('img').removeAttr('src')
    list.forEach((a, i) => {
      // 跑所有的list並且加上URL連結
      $img.eq(i).find('img').attr('src', URL.createObjectURL(a))
    })
    $(':submit')[list.length === 3 ? 'removeClass' : 'addClass']('warn')
  }
  $('[type="file"]').change({
    f() {
      var selectFile = [].slice.call(this.files)
      $form[0].reset()
      $msg.val('')
      addedFile.length + selectFile.length <= 3 ? (() => {
        var task = []
        selectFile.forEach(file => {
          // 存到Promise陣列
          task.push(new Promise((resolve, reject) => {
            var img = new Image()
            img.onload = {
              f() {
                resolve({ width: this.width, height: this.height })
              }
            }.f
            img.onerror = e => {
              reject(e.type)
            }
            img.src = URL.createObjectURL(file)
          }))
        })
        // 檢查照片的程式
        // 利用promise處理非同步，不用管照片先後順序
        // 等它全部讀完就執行result
        Promise.all(task).then(result => {
          universal.checkImage(result) ? (() => {
            selectFile.forEach(file => {
              addedFile.push(file)
            })
            // 顯示照片
            showImage(addedFile)
          })() : $msg.val('尺寸超過150x150')
        }, () => {
          $msg.val('檔案格式錯誤')
        })
      })() : $msg.val('選取超過3張')
    }
  }.f)
  $img.click({f () {
    $msg.val('')
    addedFile.splice($img.index(this), 1)
    showImage(addedFile)
  }}.f)
  // 因為這邊沒有form的input來submit，所以要攔截submit在post上去
  // contentType、processData 取消編碼(一定要加)，不然上傳會出問題
  $form.submit(e => {
    var formDate = new FormData()
    addedFile.forEach(file => {
      formDate.append('Photos', file)
    })
    $.ajax({
      type: 'POST',
      data: formDate,
      contentType: false,
      processData: false,
    }).done(url => {
      url ? location.href = url : alert('error')
    })
    e.preventDefault()
  })
})