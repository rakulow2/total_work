const express = require('express');
const router = express.Router();
const {Users} = require('../models');


// API : 회원가입
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  try {
    // 유효성 검사 : 닉네임,비밀번호 정규식 확인
    const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
    const passwordRegex = /^.{4,}$/;

    if (!nicknameRegex.test(nickname) || !passwordRegex.test(password)) {
      return res.status(412).json({
        "errorMessage": "닉네임과 비밀번호를 알맞게 입력해주세요."
      })
    }

    // 유효성 검사 : id값과 password에 같은 값이 포함된 경우 
    if (password.includes(nickname) || nickname.includes(password)) {
      return res.status(412).json({
        "errorMessage": "패스워드에 닉네임이 포함되어 있습니다."
      })
    }

    // 유효성 검사 : confim과 password 비교
    if (password !== confirm) {
      return res.status(412).json({
        "errorMessage": "패스워드가 일치하지 않습니다"
      })
    }

    // 유효성 검사: 중복 닉네임 확인
    const userCheck = await Users.findOne({where:{nickname}})
    if (userCheck) {
      return res.status(412).json({
        "errorMessage": "중복된 닉네임입니다."
      });
    }
    
    await Users.create({
      nickname, password 
    })

    res.status(201).json({
      "message": "회원가입에 성공했습니다."
    })
  } catch (error) {
    console.error(error);
    res.status(400).json({
      "errorMessage": "회원가입에 실패했습니다."
    })
  }
});


module.exports = router;