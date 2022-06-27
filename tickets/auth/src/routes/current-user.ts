import expres from 'express';

const router = expres.Router();

router.get('/api/users/currentuser', (_req, res) => {
  res.send('Hi');
});

export { router as currentUserRouter };