const express = require('express')
const app = express()

//user-demo 호출
const userRouter = require('./routes/users')

//channel-demo 호출
const channelRouter = require('./routes/channels')


app.use("/", userRouter)
app.use("/channels",channelRouter)


app.listen(3000);