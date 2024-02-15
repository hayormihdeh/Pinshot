import express from 'express';
import * as AuthController from '../Controllers/user.js';
import { verifyToken, Roles } from '../middleware/authVerify.js';
import { genLimiter } from '../middleware/rateLimit.js'
// import { signUp } from "../Controllers/user.js"

const router = express.Router();

router.post('/signUp', AuthController.signUp);
router.post('/login', genLimiter, AuthController.login);

//Verify User Email
router.post(
  '/resend-token/:id',
  verifyToken(Roles.All),
  genLimiter,
  AuthController.sendEmailVerificationLink
);
router.patch(
  '/verify-account/:id/:token',
  verifyToken(Roles.All),
  genLimiter,
  AuthController.verifyAccount
);

//reset user password
router.post(
    '/verify-email',
    genLimiter,
    AuthController.recoverPasswordLink
  );

router.patch(
    '/reset-password/:id/:token',
    AuthController.resetUserPassword
  );



//Authenticate user
router.get('/', verifyToken(Roles.All), AuthController.authenticateUser);

router.get(
  '/profile/:userName',
  verifyToken(Roles.All),
  AuthController.getUserProfile
);

// to update something we make use of the PUT or the Patch
router.patch(
  '/update-user',
  verifyToken(Roles.All),
  AuthController.updateUserProfile
);

//user Engagement
router.put("/follow/:id",verifyToken(Roles.All), AuthController.followAUser)


//unfollow User
router.put("/unfollow/:id",verifyToken(Roles.All), AuthController.unfollowAUser)
//get following
router.get("/following/:id",verifyToken(Roles.All), AuthController.getFollowedUsers )
//get followers
router.get("/followers/:id",verifyToken(Roles.All), AuthController.getFollowers )

export default router;