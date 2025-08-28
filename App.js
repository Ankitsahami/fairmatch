import React, { useState } from 'react';
import { utils } from 'ethers';
import { poseidon } from 'circomlibjs';
import { Walrus } from '@mysten/walrus';

function App() {
  const [userId, setUserId] = useState('');
  const [rank, setRank] = useState('');
  const [minRank, setMinRank] = useState('');
  const [maxRank, setMaxRank] = useState('');
  const [proofBlobId, setProofBlobId] = useState('');
  const [attestationId, setAttestationId] = useState('');

  const handleIssueCredential = async () => {
    try {
      const response = await fetch("http://localhost:3000/issue-credential", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, rank: parseInt(rank) }),
      });
      const data = await response.json();
      console.log('Credential issued:', data);
      // In a real app, you'd securely store salt and nonce for proof generation
    } catch (error) {
      console.error('Error issuing credential:', error);
    }
  };

  const handleGenerateProofAndUpload = async () => {
    // This is a simplified example. In a real app, you'd run circom and snarkjs
    // to generate the actual proof using the private inputs (uidHash, rank, nonce, salt)
    // and public inputs (commit, minRank, maxRank).
    // For this PoC, we'll simulate a proof and upload it.

    // Dummy proof generation (replace with actual ZK proof generation)
    const dummyProof = {
      proof: { pi_a: ["0x1", "0x2", "0x3"], pi_b: [["0x4", "0x5"], ["0x6", "0x7"]], pi_c: ["0x8", "0x9", "0xa"] },
      public: ["0x123", "0x456", "0x789"]
    };

    try {
      const walrus = new Walrus();
      const uploadRes = await walrus.uploadFile(Buffer.from(JSON.stringify(dummyProof)), { filename: 'proof.json' });
      setProofBlobId(uploadRes.blobId);
      console.log('Proof uploaded to Walrus:', uploadRes.blobId);

      // Simulate soundness-cli send command
      // In a real scenario, this would be a shell command executed by the agent or a backend service
      const simulatedSoundnessCliOutput = `soundness-cli send --proof-file ${uploadRes.blobId} --game fairmatch --key-name my-key --proving-system groth16 --payload '{"minRank":${minRank},"maxRank":${maxRank},"commit":"0x123"}'`;
      console.log('Simulated soundness-cli command:', simulatedSoundnessCliOutput);
      setAttestationId('simulated_attestation_id_123'); // Replace with actual attestation ID from soundness-cli

    } catch (error) {
      console.error('Error generating or uploading proof:', error);
    }
  };

  return (
    <div>
      <h1>FairMatch Player Client</h1>
      <div>
        <h2>Issue Credential (Simulated)</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />
        <button onClick={handleIssueCredential}>Issue Credential</button>
      </div>
      <div>
        <h2>Generate Proof & Upload to Walrus</h2>
        <input
          type="number"
          placeholder="Min Rank"
          value={minRank}
          onChange={(e) => setMinRank(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Rank"
          value={maxRank}
          onChange={(e) => setMaxRank(e.target.value)}
        />
        <button onClick={handleGenerateProofAndUpload}>Generate & Upload Proof</button>
        {proofBlobId && <p>Proof Blob ID: {proofBlobId}</p>}
        {attestationId && <p>Attestation ID: {attestationId}</p>}
      </div>
    </div>
  );
}

export default App;

