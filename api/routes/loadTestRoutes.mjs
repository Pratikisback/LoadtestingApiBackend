import express from 'express';
import  {runLoadTest}  from '../controllers/loadTestController.mjs';

const router = express.Router();

router.post('/data', async (req, res) => {
    try {
        await runLoadTest(req, res);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ error: `${error}` });
    }
});

export default router;