import express from 'express';
import * as SearchController from '../Controllers/search.js';
import { verifyToken, Roles } from '../middleware/authVerify.js';

const router = express.Router();

router.get('/tags', verifyToken(Roles.All), SearchController.getTags);
router.get('/:id/tags', verifyToken(Roles.All), SearchController.deleteATag);
router.get('/', verifyToken(Roles.All), SearchController.searchDb);

export default router;