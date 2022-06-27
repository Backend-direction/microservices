import expres from 'express';

const router = expres.Router();

router.post('/api/users/signin', (_req, res) => {
  res.send('Hi');
});

export { router as signinRouter };