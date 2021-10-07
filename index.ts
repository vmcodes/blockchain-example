import { MOCK_DATA } from "./MOCK_DATA";

interface Transaction {
  sender: string;
  receiver: string;
  amount: number;
}

type Block = {
  index: number;
  transactions: Array<Transaction>;
  timestamp: number;
  previousHash: string;
  nonce: number;
  hash: string;
};

type Blockchain = {
  length: number;
  chain: Array<Block>;
};

class MyBlockchain {
  chainData: Blockchain = { length: 0, chain: [] };
  difficulty = "00";

  computeHash = (block: Block): string => {
    let blockString = this.difficulty + JSON.stringify(block);
    let proof = require("crypto")
      .createHash("sha256")
      .update(blockString)
      .digest("hex");

    return proof;
  };

  // initialize first block and add to blockchain
  createGenesisBlock = (): void => {
    let genesisBlock: Block = {
      index: 0,
      transactions: [],
      timestamp: Date.now(),
      previousHash: "0",
      nonce: 0,
      hash: "",
    };

    genesisBlock.hash = this.computeHash(genesisBlock);

    Object.assign(this.chainData, {
      length: 1,
      chain: [genesisBlock],
    });
  };

  /**
   * recursively compute PoW
   * and return a hash
   */
  proofOfWork = (block: Block): string => {
    let hash = this.computeHash(block);
    while (!hash.slice(0, this.difficulty.length).includes(this.difficulty)) {
      block.nonce++;
      hash = this.proofOfWork(block);
    }

    return hash;
  };

  // creates new block and appends it to the initial blockchain
  createNewBlock = (transaction: Transaction): void => {
    let newBlock: Block = {
      index: this.lastBlock().index + 1,
      transactions: [transaction],
      timestamp: Date.now(),
      previousHash: this.lastBlock().hash,
      nonce: 0,
      hash: "",
    };

    newBlock.hash = this.proofOfWork(newBlock);
    let chain = [...this.chainData.chain, newBlock];

    Object.assign(this.chainData, {
      length: this.chainData.length + 1,
      chain: chain,
    });
  };

  // return last block
  lastBlock = (): Block => {
    return this.chainData.chain[this.chainData.length - 1];
  };

  // return last transaction
  lastTransaction = (): Transaction => {
    return this.lastBlock().transactions[
      this.lastBlock().transactions.length - 1
    ];
  };

  /**
   * if genesis block or under 100 transactions,
   * then create new block, else append to current block
   */
  addTransaction = (transaction: Transaction): void => {
    if (
      this.lastBlock().index === 0 ||
      this.lastBlock().transactions.length === 100
    ) {
      this.createNewBlock(transaction);
    } else {
      this.lastBlock().transactions.push(transaction);
    }
  };

  toString = (): void => {
    console.dir(this.chainData);
  };
}
const blockChain = new MyBlockchain();
blockChain.createGenesisBlock();

console.time("proof");

MOCK_DATA.forEach((transaction) => blockChain.addTransaction(transaction));
blockChain.toString();
console.dir(blockChain.lastBlock().hash);

console.timeEnd("proof");
