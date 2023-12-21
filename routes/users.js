const express = require('express')
const router = express.Router()
const conn = require('../mariadb');

// JSON 형태의 요청(request) body를 파싱하기 위해 사용되는 미들웨어
router.use(express.json())

//로그인
router.post('/login', function(req, res) {
    //userId가 db에 저장된 회원인지 확인
    let {email, password} = req.body

    conn.query(
        `SELECT * FROM users WHERE email = ?`, email,
        function(err, results) {
            let loginUser = results[0]
    
            if (loginUser && loginUser.password == password) {
                res.status(200).json({
                    message: `${loginUser.name}님 로그인 되었습니다.`
                })
            }
            else {
                res.status(404).json({
                    message: '이메일 또는 비밀번호가 틀렸습니다.'
                })
            }
        }
      )
})


//회원가입
router.post('/join', function(req, res) {
    if(req.body == {}) {
        res.status(400).json({
            message : '입력 값을 다시 확인해주세요'
        })
    } 
    else {
        const {email, name, password, contact} = req.body

        conn.query(
            `INSERT INTO users (email, name, password, contact) 
                VALUES (?, ?, ?, ?)`, [email, name, password, contact],
            function(err, results) {
                res.status(201).json(results)
            }
        )
    }
})

router
    .route('/users')
    //개별 조회
    .get(function(req, res) {
        let {email} = req.body

        conn.query(
            `SELECT * FROM users WHERE email = ?`, email,
            function(err, results) {
                res.status(200).json(results)
            }
        );  
    })
    //개별 탈퇴
    .delete(function(req, res) {
        let {email} = req.body;
        
        conn.query(
            `DELETE FROM users WHERE email = ?`, email,
            function(err, results) {
                res.status(200).json(results)
            }
        );  
    })


module.exports = router

