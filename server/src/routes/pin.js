import express from 'express';
import * as PinController from '../Controllers/pin.js';
import { verifyToken, Roles } from '../middleware/authVerify.js';
// import { genLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/create', verifyToken(Roles.All), PinController.createAPin);

router.get('/', PinController.getAllPins);
router.get('/random-explore', PinController.getRandomPins);

router.get('/follow', verifyToken(Roles.All), PinController.getFollowedPins);

router.get(
  '/:id/userpins',
  verifyToken(Roles.All),
  PinController.getPinsByUser
);

router.get('/:id', verifyToken(Roles.All), PinController.getASinglePin);

router.put('/like/:id', verifyToken(Roles.All), PinController.likeAPin);

router.put('/dislike/:id', verifyToken(Roles.All), PinController.disLikeAPin);

router.get('/:id/likedpins', verifyToken(Roles.All), PinController.getPinsLikedByUser);

router.patch('/:id', verifyToken(Roles.All), PinController.updateAPin);

router.delete('/:id', verifyToken(Roles.All), PinController.deleteAPin);

router.get('/:id/related', verifyToken(Roles.All), PinController.getRelatedPins);

export default router;
 