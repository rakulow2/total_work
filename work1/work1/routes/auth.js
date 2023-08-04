const express = require("express");
const router = express.Router();

const Guestbook = require("../schemas/guestbook.js");
const Userinfo = require("../schemas/userinfo.js");

router.get("/comments", async(req, res) => {
  const guestbooks = await Guestbook.find({});

  const usernumbers = guestbooks.map((guestbook) =>{
    return guestbook.usernumber;
  })

  const userinfo = await Userinfo.find({usernumbers: usernumbers});
  //userinfo에 해당하는 모든 정보를 가지고 올건데
  //만약 usernumbers 변수 안에 존재하는 값일 때만 가져와

  const results = guestbooks.map((guestbook)=>{
    return {
      "comment": guestbook.comment,
      "userinfo": userinfo.find((item)=> item.usernumber===guestbook.usernumber),

    }
  })

  res.json({
    "guestbooks": results,
  })

});


module.exports = router;