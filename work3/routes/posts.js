const express = require('express');
const router = express.Router();
const {Posts, Users} = require('../models');

// 미들웨어
const authMiddleware = require('../middlewares/auth-middleware');


// POST: 게시물 등록하기
router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = res.locals.user;

  // 유효성 검사: body, params
  if (!title || !content) {
    throw new Error("데이터 형식이 올바르지 않습니다.");
  }

  try {
    const newPost = await Posts.create({
      UserId: userId,
      title,
      content
    });

    res.status(202).json({ "message": "게시글을 생성하였습니다.", "post": newPost });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      errorMessage: "게시글 작성에 실패하였습니다."
    });
  }
});


// GET : 게시물 조회
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.findAll({ })
    
    if (!posts.length) {
      return res.status(400).json({
      errorMessage: "게시물 존재 하지 않습니다.."
    })}
    {
      res.status(200).json({data:posts
      })
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "게시물 조회가 실패했습니다."
    })
  }

});

// get 특정 게시물 가져오기
router.get("/posts/:postId", auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const oneReview = await Reviews.findOne({ where: { userId } });
    res.status(200).json({ data: oneReview });
  } catch (error) {
    res.status(400).json({ message: '리뷰 찾기가 실패 했습니다.' });
  }
});


// put 게시물 수정하기
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  try {
      const post = await Posts.findOne({ where: { postId } });
      if (!post) {
          return res.status(404).json({  errorMessage: "게시물이 존재 하지 않습니다." });
      } else if (post.UserId !== userId) {
          return res.status(401).json({  errorMessage: "권한이 없습니다." });
      }
      await Posts.update(
          { title, content }, 
          {
            where: {
              [Op.and]: [{ postId }, { UserId: userId }]
            }
          }   
      );
      return res.status(200).json({ message: "게시물이 수정되었습니다." });
        }
        catch (error)
        {
          res.status(400).json({ errMessage: "게시물 수정에 실패하였습니다." });
        }
      })


// DELETE : 게시물 삭제하기
router.delete("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const post = await Posts.findOne({ where: { postId }});
    if (!post){
      res.status(404).json({ errMessage: "게시물이 존재하지 않습니다." });
    } else {
      if (userId !== post.userId) {
        res.status(403).json({ errMessage: "게시물 삭제 권한이 존재하지 않습니다." });
      }else if (post.UserId !== userId) {
        await Posts.deleteOne({ id: postId });
        res.status(200).json({ message: "게시물을 삭제하였습니다." });
      } 
    } 
  } catch (error) {
    res.status(400).json({ errMessage: "게시물이 정상적으로 삭제되지 않았습니다." });
  }
});
 
module.exports = router