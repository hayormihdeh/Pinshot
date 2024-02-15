import express from 'express';
import * as CommentController from '../Controllers/comment.js';
import { verifyToken, Roles } from '../middleware/authVerify.js';
// import { genLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/:id/add', verifyToken(Roles.All),
 CommentController.addAComment);

router.get('/:id', verifyToken(Roles.All),
 CommentController.getComment);

router.delete('/:id', verifyToken(Roles.All),
 CommentController.deleteAComment);

router.put('/:id/like', verifyToken(Roles.All),
 CommentController.likeAComment);
         
router.put(
  '/:id/dislike',
  verifyToken(Roles.All),
  CommentController.disLikeAComment
);

export default router;
