const express = require('express')

const router = express.Router()

router.use(express.json())

let db = new Map();
let id = 1;

router
    .route('/')
    //채널 전체 조회
    .get(function(req, res) {
        //요청 body에 회원의 Id를 담아 보냄 
        let {userId} = req.body
        let channels = [];
        if(db.size && userId) {

            db.forEach(function(value, key) {
                //userId가 일치할 경우 channels 배열에 push
                if(value.userId == userId) {
                  channels.push(value)
                }
            })

            // 2) userId가 가진 채널이 없으면 즉, channels = [] 인 상태
            if(channels.length) {
              res.status(200).json(channels)
            }
            else {
              notFoundChannel(res)
            }
           
        }
        else {
          notFoundChannel(res)
        }
    })

    //채널 개별 생성
    .post(function(req, res) {
        if(req.body.channelTitle) {
          let channel = req.body
          db.set(id++, channel)

          res.status(201).json({
            message : `${db.get(id-1).channelTitle}님 채널 생성되었습니다.`
          })
        }
        else{
          res.status(400).json({
            message : '채널명을 제대로 입력해주세요.'
          })
        }
    })
  

router
    .route('/:id')
    //채널 개별 조회
    .get(function(req, res) {
        let {id} = req.params;
        id = parseInt(id);

        let channel = db.get(id)

        if(channel) {
          res.status(200).json(channel)
        }
        else {
          notFoundChannel(res)
        }
    })


    //채널 개별 수정
    .put(function(req, res) {
        let {id} = req.params;
        id = parseInt(id);

        let channel = db.get(id);
        let preChannelTitle = channel.channelTitle;

        if(channel) {
          let newChannelTitle = req.body.channelTitle;
          channel.channelTitle = newChannelTitle;
          //db 덮어쓰기
          db.set(id, channel);
          
          res.status(200).json({
            message: `채널명 ${preChannelTitle}에서 ${newChannelTitle}로 정상적으로 수정되었습니다.`
          })
        }
        else {
          notFoundChannel(res)
        }
    })

    //채널 개별 삭제
    .delete(function(req, res) {
        let {id} = req.params;
        id = parseInt(id);

        let channel = db.get(id)

        if(channel) {
          db.delete(id)
          res.status(200).json({
            message : `채널명 ${channel.channelTitle} 이 성공적으로 삭제되었습니다.`
          })
        }
        else {
          notFoundChannel()
        }
    })


function notFoundChannel(res) {
  res.status(404).json({
    message : '채널 정보를 찾을 수 없습니다.'
  })
}

module.exports = router