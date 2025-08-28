import express from 'express';
import { Walrus } from '@mysten/walrus';
import { utils } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const walrus = new Walrus();

app.post('/start-game', async (req, res) => {
  const { lobbyBlobId } = req.body;

  if (!lobbyBlobId) {
    return res.status(400).send('lobbyBlobId is required');
  }

  try {
    // Fetch lobby from Walrus
    const lobbyBlob = await walrus.downloadFile(lobbyBlobId);
    const lobby = JSON.parse(lobbyBlob.toString());

    // Verify matchmaker signature (simplified - in a real app, you'd use the public key)
    const recoveredAddress = utils.verifyMessage(utils.arrayify(utils.keccak256(Buffer.from(JSON.stringify(lobby)))), lobby.signature);
    if (recoveredAddress !== lobby.matchmakerPub) {
      return res.status(403).send('Invalid matchmaker signature');
    }

    console.log('Game started with lobby:', lobby);
    res.status(200).send('Game started successfully');
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).send('Failed to start game');
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Game server listening on port ${PORT}`);
});
});

