const express = require('express')
const router = express.Router()

let db = new Map();
let id = 1;

// JSON 형태의 요청(request) body를 파싱하기 위해 사용되는 미들웨어
router.use(express.json())

//로그인
router.post('/login', function(req, res) {
  //userId가 db에 저장된 회원인지 확인
  let {userId, password} = req.body;
  let loginUser = {};

  db.forEach(function(user, id) {
      if(user.userId == userId) {
          loginUser = user
      }
  });
  

  if(isExist(loginUser)) {
      
      //password가 db에 저장된 회원인지 확인
      if(loginUser.password == password) {
        res.status(200).json({
          message: `${loginUser.name}님 로그인 되었습니다.`
        })
      }
      else {
        res.status(400).json({
          message: '비밀번호가 틀렸습니다.'
        })
      }
  }
  else {
    res.status(404).json({
      message: '회원정보가 없습니다.'
    })
  }
});


function isExist(obj) {
    if(Object.keys(obj).length) {
      return true;
    }
    else {
      return false;
    }
};

//회원가입
router.post('/join', function(req, res) {
    if(req.body.name == undefined) {
      res.status(400).json({
        message : '입력 값을 다시 확인해주세요'
      })
    }
    else {
      const {userId} = req.body
      db.set(userId, req.body);

      res.status(201).json({
        message : `${db.get(userId).name}님 환영합니다.`
      })
    }
});

router
  .route('/users')
  //개별 조회
  .get(function(req, res) {
    let {userId} = req.body;

    const user = db.get(userId)
  
    if(user) {
        res.status(200).json({
          userId : user.userId,
          name : user.name
        })
    }
    else {
        res.status(404).json({
          message: '찾으시는 회원 정보가 없습니다.'
        })
    }
  })
  //개별 탈퇴
  .delete(function(req, res) {
    let {userId} = req.body;
    const user = db.get(userId)

    if(user) {
        db.delete(id)
    
        res.status(200).json({
          message: `${user.name}님 탈퇴가 되었습니다.`
        })
    }
    else {
        res.status(404).json({
          message: '찾으시는 회원 정보가 없습니다.'
        })
    }
  })


module.exports = router