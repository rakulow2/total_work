const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001;



//-- 라우트 설정 --//
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth.js')
//-- 미들웨어 설정 --//
app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, authRouter, postsRouter]);


//-- 서버 시작 --//
app.listen(port, () => {
  console.log("3000번 포트 열렸습니다.");
});
