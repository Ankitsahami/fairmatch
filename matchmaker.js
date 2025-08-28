import express from 'express';
import { Connection, JsonRpcProvider } from "@mysten/sui/dist/esm/client/index.js";
import { Walrus } from '@mysten/walrus';
import { Wallet, utils } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const SUI_NETWORK = process.env.SUI_NETWORK || 'testnet';
const SUI_RPC_URL = process.env.SUI_RPC_URL || `https://fullnode.${SUI_NETWORK}.sui.io`;
const connection = new Connection({ fullnode: SUI_RPC_URL });
const provider = new JsonRpcProvider(connection);
const walrus = new Walrus();

app.post('/create-lobby', async (req, res) => {
  const { playerAttestationIds, minRank, maxRank } = req.body;

  if (!playerAttestationIds || !Array.isArray(playerAttestationIds) || playerAttestationIds.length === 0) {
    return res.status(400).send('playerAttestationIds are required and must be an array');
  }

  try {
    // Verify attestations (simplified - in a real app, you'd fetch and verify each attestation on Sui)
    const verifiedPlayers = [];
    for (const attestationId of playerAttestationIds) {
      // Simulate attestation verification
      console.log(`Verifying attestation: ${attestationId}`);
      // In a real scenario, you'd query Sui for the attestation object and verify its content
      // For this PoC, we assume they are valid if provided.
      verifiedPlayers.push({ playerProofBlob: `simulated_blob_for_${attestationId}`, attestationTx: attestationId });
    }

    const lobby = {
      bracket: 'Gold', // Simplified, could be dynamic based on min/max rank
      minRank: minRank,
      maxRank: maxRank,
      players: verifiedPlayers,
      timestamp: Date.now(),
    };

    // Sign the lobby (Matchmaker's signature)
    const signer = new Wallet(process.env.MATCHMAKER_PRIVATE_KEY);
    const lobbySignature = await signer.signMessage(utils.arrayify(utils.keccak256(Buffer.from(JSON.stringify(lobby)))));

    const lobbyBlob = { ...lobby, signature: lobbySignature, matchmakerPub: signer.address };

    // Upload lobby to Walrus
    const uploadRes = await walrus.uploadFile(Buffer.from(JSON.stringify(lobbyBlob)), { filename: 'lobby.json' });
    const lobbyBlobId = uploadRes.blobId;

    res.status(200).json({ lobbyBlobId, lobby });
  } catch (error) {
    console.error('Error creating lobby:', error);
    res.status(500).send('Failed to create lobby');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Matchmaker service listening on port ${PORT}`);
});


