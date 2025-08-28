import { buildPoseidon } from "circomlibjs";
import { Wallet, utils } from "ethers";
import crypto from "crypto";

export async function issueCredential(userId, rank) {
  const uidHash = utils.keccak256(Buffer.from(userId)).slice(2); // hex
  const nonce = crypto.randomBytes(8).toString("hex");
  const salt = crypto.randomBytes(16).toString("hex");
  const poseidon = await buildPoseidon();
  const commit = poseidon([BigInt("0x"+uidHash), BigInt(rank), BigInt("0x"+nonce), BigInt("0x"+salt)]);
  const commitHex = '0x' + commit.toString(16);
  const signer = new Wallet(process.env.ISSUER_PRIVATE_KEY);
  const sig = await signer.signMessage(utils.arrayify(commitHex));
  const blob = { commit: commitHex, sig, rank, nonce }; // issuer stores blob in Walrus or returns to player
  return { blob, salt }; // salt returned privately to player
}

