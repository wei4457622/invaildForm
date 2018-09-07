// 載入後端程式
var universal = require('./public/universal')
// 開啟node express
var express = require('express')
// body-parser套件可以使用post
var bodyParser = require('body-parser')
// 載入後端需要的套件
var fileUpload = require('express-fileupload')
var sizeOf = require('image-size')

var app = express();
app.use(fileUpload())
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false}))

// 把前端的表單帶入後端
app.post('/step1.html', (req, res) => {
  // 載入後端的mail驗證
  universal.checkEmail(req.body.Email) &&
  universal.checkPassword(req.body.Password) &&
  universal.checkConfirmPassword(req.body.ConfirmPassword) ? (() => {
    // 如果三個資料都正確則立即執行
    // redirect 重定向到第二頁
      res.redirect('/step2.html')
      console.log(req.body)
    })() : res.send('error')
})

app.post('/step2.html', (req, res) => {
  universal.checkPhone(req.body.Phone) &&
  universal.checkAddress(req.body.Address) ? (() => {  
      res.redirect('/step3.html')
      console.log(req.body)
    })() : res.send('error')
})

app.post('/step3.html', (req, res) => {
  var uploadFiles = req.files.Photos
  uploadFiles && !Array.isArray(uploadFiles) && (() => { // 一張是物件，多張是陣列(通通改陣列比較方便)
    uploadFiles = [uploadFiles]
  })()
  var files = uploadFiles && uploadFiles.map(file => {
    var size = sizeOf(file.data)
    return { width: size.width, height: size.height }
  })
  var result = false
  uploadFiles && universal.checkImage(files) && (() => {
    uploadFiles.forEach(file => {
      // 儲存資料到upload資料夾
      file.mv(`./upload/${file.name}`)
    })
    result = true
  })()
  req.headers['x-requested-with'] === 'XMLHttpRequest' ? (
    res.json(result ? '/step4.html' : '')) : (
      result ? res.redirect('/step4.html') : res.send('error'))
})

app.post('/step4.html', (req, res) => {
  universal.checkCardNumber(req.body.CardNumber) ? (() => {
    res.redirect('/step5.html')
    console.log(req.body)
  })() : res.send('error')
})

app.listen(3000)