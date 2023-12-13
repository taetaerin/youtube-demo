const express = require('express')
const app = express()

let db = new Map();
let id = 1;

// JSON 형태의 요청(request) body를 파싱하기 위해 사용되는 미들웨어
app.use(express.json())

//로그인
app.post('/login', function(req, res) {
  // let {id, pwd} = req.body;
  // res.json({
  //   message: ""
  // })
})

//회원가입
app.post('/join', function(req, res) {
  console.log(req.body)

  if(req.body.name == undefined) {
    res.status(400).json({
      message : '입력 값을 다시 확인해주세요'
    })
  }
  else {
    db.set(id++, req.body);

    res.status(201).json({
      message : `${db.get(id-1).name}님 환영합니다.`
    })
  }
})

app
  .route('/users/:id')
  //개별 조회
  .get(function(req, res) {
    let {id} = req.params;
    id = parseInt(id);
  
    const user = db.get(id)
  
    if(user == undefined) {
      res.status(404).json({
        message: '찾으시는 회원 정보가 없습니다.'
      })
    }
    else {
      res.status(200).json({
        userId : user.userId,
        name : user.name
      })
    }
  })
  //개별 탈퇴
  .delete(function(req, res) {
    let {id} = req.params;
    id = parseInt(id);
    
    const user = db.get(id)
  
    if(user == undefined) {
      res.status(404).json({
        message: '찾으시는 회원 정보가 없습니다.'
      })
    }
    else {
      db.delete(id)
  
      res.status(200).json({
        message: `${user.name}님 탈퇴가 되었습니다.`
      })
    }
  })



app.listen(3000)