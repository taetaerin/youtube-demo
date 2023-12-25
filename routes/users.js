const express = require('express')
const router = express.Router()
const { body, param, validationResult } = require('express-validator');
const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req)

    if(err.isEmpty()) {
        return next() 
    }
    else {
        return res.status(400).json(err.array());
    }
}

//로그인
router
    .post(
        '/login',
        [
            body('email').notEmpty().isEmail().withMessage('email을 확인해주세요'),
            body('password').notEmpty().isString().withMessage('password을 확인해주세요'),
            validate
        ],
        function(req, res, next) {
            const {email, password} = req.body
            let sql = `SELECT * FROM users WHERE email = ?`
            
            conn.query(sql, email,
                function(err, results) {
                    if(err) {
                        return res.status(400).end()
                    }

                    let loginUser = results[0]
                    
                    if (loginUser && loginUser.password == password) {
                        //token 발급
                        const token = jwt.sign({
                            email: loginUser.email,
                            name: loginUser.name
                        }, process.env.PRIVATE_KEY, {
                            expiresIn: '30m',
                            issuer: 'taetae'
                        })

                        res.cookie("token", token, {
                            httpOnly: true
                        })
                        
                        console.log(token)

                        res.status(200).json({
                            message: `${loginUser.name}님 로그인 되었습니다.`,
                        })
                    }
                    else {
                        res.status(401).json({
                            message: '이메일 또는 비밀번호가 틀렸습니다.'
                        })
                    }
                }
            )
    })


//가입하기
router.post(
    '/join', 
    [
        body('email').notEmpty().isEmail().withMessage('email을 확인해주세요'),
        body('name').notEmpty().isString().withMessage('name을 확인해주세요'),
        body('password').notEmpty().isString().withMessage('password을 확인해주세요'),
        body('contact').notEmpty().isString().withMessage('contact을 확인해주세요'),
        validate
    ],
    function(req, res, next) {
        const {email, name, password, contact} = req.body
        
        let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
        let values = [email, name, password, contact]
        conn.query(sql, values,
            function(err, results) {
                if(err) {
                    return res.status(400).end()
                }

                res.status(201).json(results)
            }
        )
    })


//회원 개별 조회
router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('email을 확인해주세요'),
            validate
        ],
        function(req, res, next) {
            let {email} = req.body
            
            let sql = `SELECT * FROM users WHERE email = ?`
            conn.query(sql, email,
                function(err, results) {
                    if(err) {
                        return res.status(400).end()
                    }

                    res.status(200).json(results)
                }
            );  
    })
    //회원 개별 탈퇴
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('email을 확인해주세요'),
            validate
        ],
        function(req, res, next) {
            let {email} = req.body;
            
            let sql = `DELETE FROM users WHERE email = ?`
            conn.query(sql, email,
                function(err, results) {
                    if(err) {
                        return res.status(400).end()
                    }

                    if(results.affectedRows == 0) {
                        return res.status(400).end()
                    }
                    else {
                        res.status(200).json(results)
                    }
                }
            );  
    })


module.exports = router

