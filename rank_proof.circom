pragma circom 2.0.0;
include "circomlib/poseidon.circom";
include "circomlib/lessThan.circom";

template RankProof() {
  // public
  signal input commit;
  signal input minRank;
  signal input maxRank;

  // private
  signal private input uidHash;
  signal private input rank;
  signal private input nonce;
  signal private input salt;

  // compute
  component hasher = Poseidon(4);
  hasher.inputs[0] <== uidHash;
  hasher.inputs[1] <== rank;
  hasher.inputs[2] <== nonce;
  hasher.inputs[3] <== salt;
  hasher.out[0] === commit;

  // range check: minRank <= rank <= maxRank
  component lt1 = LessThan(32);
  lt1.in[0] <== rank;
  lt1.in[1] <== maxRank;
  lt1.out === 1;

  component lt2 = LessThan(32);
  lt2.in[0] <== minRank;
  lt2.in[1] <== rank;
  lt2.out === 1;
}
component main = RankProof();

