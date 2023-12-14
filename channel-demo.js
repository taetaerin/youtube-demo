const express = require('express')
const app = express()
app.use(express.json())

let db = new Map();
let id = 1;

app
    .route('/channels')
    //채널 전체 조회

    .get(function(req, res) {
      let channels = [];
      
      if(db.size) {
        db.forEach(function(value, key) {
          channels.push(value)
        })
        res.status(200).json(channels)
      }
      else {
        res.status(404).json({
          message: '전체 채널 정보를 찾을 수 없습니다.'
        })
      }
    })

    //채널 개별 생성
    .post(function(req, res) {
      if(req.body.channelTitle) {
        db.set(id++, req.body)

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
  

app
    .route('/channels/:id')
    //채널 개별 조회
    .get(function(req, res) {
      let {id} = req.params;
      id = parseInt(id);

      let channel = db.get(id)

      if(channel) {
        res.status(200).json(channel)
      }
      else {
        res.status(404).json({
          message: '채널 정보를 찾을 수 없습니다.'
        })
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
        res.status(404).json({
          message : '채널 정보를 찾을 수 없습니다.'
        })
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
        res.status(404).json({
          message : '채널 정보를 찾을 수 없습니다.'
        })
      }

    })
  

app.listen(3000);