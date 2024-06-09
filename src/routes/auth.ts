import { read } from '@auth/controllers/signin';
import { create } from '@auth/controllers/signup';
import { verifyEmail } from '@auth/controllers/verify-email';
import { forgotPassword, resetPassword, changePassword } from '@auth/controllers/password';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', read);
  router.put('/verify-email', verifyEmail);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);

  return router;
}