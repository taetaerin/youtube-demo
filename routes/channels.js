const express = require('express')
const router = express.Router()
const { body, param, validationResult } = require('express-validator');
const conn = require('../mariadb')

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

router
    .route('/')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('userId는 숫자로 입력해주세요'),
            validate
        ]
        ,function(req, res, next) {
            let {userId} = req.body

            let sql = `SELECT * FROM channels WHERE user_id = ?`

            conn.query(sql, userId,
                function(err, results) {
                    if(err) {
                        return res.status(400).end();
                    }
                    if(results.length) {
                        res.status(200).json(results)
                    }
                    else {
                        res.status(404).json("찾으시는 채널이 없습니다.")
                    }
                }
            )
    })

    .post(
        [
            body('userId').notEmpty().isInt().withMessage('userId는 숫자로 입력해주세요'),
            body('name').notEmpty().isString().withMessage('name은 문자로 입력해주세요'),
            validate
        ],
        function(req, res) {
            const {name, userId} = req.body

            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`
            let values = [name, userId]
            conn.query(sql, values,
                function(err, results) {
                    if(err) {
                        return res.status(400).end()
                    }
                    res.status(201).json(results)
                }
            )
    })
  

router
    .route('/:id')
    .get(
        [
            param('id').notEmpty().withMessage('채널 아이디를 입력해주세요'),
            validate 
        ]
        ,function(req, res) {
            let {id} = req.params;
            id = parseInt(id);

            let sql = `SELECT * FROM channels WHERE id = ?`
            conn.query(sql, id,
                function(err, results) {
                    if(err) {
                        return res.status(400).end();
                    }

                    if(results.length) {
                        res.status(200).json(results)
                    }
                    else {
                        res.status(404).json('찾으시는 채널이 없습니다.')
                    }
                }
            )
    })


    //채널 개별 수정
    .put(
        [
            param('id').notEmpty().withMessage('채널 아이디를 입력해주세요'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate 
        ]
        ,function(req, res) {
            let {id} = req.params;
            id = parseInt(id);
            let {name} = req.body;

            let sql = `UPDATE channels SET name = ? WHERE id=?`
            let values = [name, id]
                conn.query(sql, values,
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
                )
        
    })

    //채널 개별 삭제
    .delete(
        [   
            param('id').notEmpty().withMessage('채널 아이디를 입력해주세요'),
            validate 
        ]
        ,function(req, res) {
            let {id} = req.params
            id = parseInt(id)

            let sql = `DELETE FROM channels WHERE id = ?`
            conn.query(sql, id,
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
            )
    })

module.exports = router