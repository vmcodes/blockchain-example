import { MOCK_DATA } from "./MOCK_DATA";

interface Transaction {
  sender: string;
  receiver: string;
  amount: number;
}

interface Block {
  index: number;
  transactions: Array<Transaction>;
  timestamp: number;
  previousHash: string;
  nonce: number;
  hash: string;
}

interface Blockchain {
  length: number;
  chain: Array<Block>;
}

class MyBlockchain {
  chainData: Blockchain = { length: 0, chain: [] };

  computeHash = (block: Block): string => {
    let blockString = JSON.stringify(block);
    return require("crypto")
      .createHash("sha256")
      .update(blockString)
      .digest("hex");
  };

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

  createNewBlock = (transaction: Transaction): void => {
    let newBlock: Block = {
      index: this.lastBlock().index + 1,
      transactions: [transaction],
      timestamp: Date.now(),
      previousHash: this.lastBlock().hash,
      nonce: 0,
      hash: "",
    };

    newBlock.hash = this.computeHash(newBlock);
    let chain = [...this.chainData.chain, newBlock];

    Object.assign(this.chainData, {
      length: this.chainData.length + 1,
      chain: chain,
    });
  };

  lastBlock = (): Block => {
    return this.chainData.chain[this.chainData.length - 1];
  };

  addTransaction = (transaction: Transaction): void => {
    if (
      this.lastBlock().index === 0 ||
      this.lastBlock().transactions.length > 100
    ) {
      this.createNewBlock(transaction);
    }

    this.lastBlock().transactions.push(transaction);
  };

  toString = (): void => {
    console.dir(this.chainData);
  };
}

const blockChain = new MyBlockchain();
blockChain.createGenesisBlock();
MOCK_DATA.forEach((transaction) => blockChain.addTransaction(transaction));

blockChain.toString();
