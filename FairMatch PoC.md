# FairMatch PoC

A proof-of-concept implementation of FairMatch, a decentralized matchmaking system using zero-knowledge proofs on the Soundness Layer.

## Overview

FairMatch solves the problem of unfair online matchmaking by using zero-knowledge (zk) proofs to ensure:
- No smurfs (fake low-rank accounts)
- No inflated or manipulated MMR
- Provably fair matchmaking that players can independently verify

## Architecture

The system consists of several components:

1. **Issuer Service** (port 3000) - Issues credential commitments for players
2. **Player Client** (port 3001) - React app for players to generate proofs and upload to Walrus
3. **Matchmaker Service** (port 3002) - Collects attestations and creates lobbies
4. **Game Server** (port 3003) - Fetches lobbies and runs matches

## Technology Stack

- **Frontend**: React + Tailwind (web client for matchmaking UI)
- **Backend**: Node.js (Express) for matchmaking coordination
- **Blockchain**: Soundness Layer (SL) as the core zk-verification layer
- **Storage**: WALRUS for verifiable lobby & match proofs
- **ZK Circuits**: Circom for rank proof generation

## Setup and Installation

### Prerequisites

1. Node.js 18+
2. Rust and Cargo
3. Circom
4. snarkjs

### Installation

1. Clone the repository
2. Install dependencies for each service:

```bash
# Issuer service
cd issuer && npm install

# Player client
cd player-client && npm install

# Matchmaker service
cd matchmaker && npm install

# Game server
cd game-server && npm install
```

### Running the Services

1. Start the issuer service:
```bash
cd issuer && node issuer-server.js
```

2. Start the player client:
```bash
cd player-client && npm start
```

3. Start the matchmaker service:
```bash
cd matchmaker && node matchmaker.js
```

4. Start the game server:
```bash
cd game-server && node game-server.js
```

## Features

- **zk-Verified Matchmaking**: Players submit zero-knowledge proofs of their rank/skill level
- **Lobby Proofs**: Each game lobby comes with a signed zk-proof of fair matchmaking
- **Dispute Resolution**: Players can verify lobby proofs on-chain

## Circuit Design

The rank proof circuit (`circuits/rank_proof.circom`) proves knowledge of:
- `uidHash`: Hashed user ID
- `rank`: Player's actual rank
- `nonce`: Unique identifier
- `salt`: Random value

Public inputs:
- `commit`: Poseidon hash commitment
- `minRank`: Minimum allowed rank for the bracket
- `maxRank`: Maximum allowed rank for the bracket

## API Endpoints

### Issuer Service (port 3000)
- `POST /issue-credential` - Issues a credential commitment for a player

### Matchmaker Service (port 3002)
- `POST /create-lobby` - Creates a lobby from verified player attestations

### Game Server (port 3003)
- `POST /start-game` - Starts a game with a verified lobby

## Security Considerations

- Nonce & replay protection included in credentials and proofs
- Privacy preserved through hashed user IDs
- Circuit correctness ensures rank boundaries are enforced
- Matchmaker signatures provide lobby authenticity

## Current Status

This is a proof-of-concept implementation. The following components are simulated:
- Soundness Layer integration (uses mock attestation IDs)
- Walrus storage (uses mock blob IDs)
- ZK proof generation (uses dummy proofs)

For a production implementation, these would need to be replaced with actual integrations to the Soundness testnet and Walrus storage network.

