import { ethers } from "ethers";
import Web3 from "web3";
import contractJSON from "../abis/NFTPod.json";

const beneficiaryAddress = "0xE7f72791D25ec97a94ccD0D32Aa5Ef1D9E7d83dE";
const contracts = {
  1: contractJSON,
  2: contractJSON,
  3: contractJSON,
  4: contractJSON,
  5: contractJSON,
  6: contractJSON,
  7: contractJSON,
  8: contractJSON,
};

export default class ContractService {
  address = "";
  contractType = 0;
  contractJSON = contracts[0];

  constructor(address = "", contractType = 0) {
    this.address = address;
    this.contractType = contractType;
    this.contractJSON = contracts[contractType];
  }

  setAddress(address) {
    this.address = address;
  }

  setContractType(contractType) {
    this.contractType = contractType;
    this.contractJSON = contracts[contractType];
  }

  isConnectedNetworkMatch = async (networkId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const chainId = await signer.getChainId();
    return parseInt(chainId) === parseInt(networkId);
  };

  deployContract = async (contractParams, errorHandler) => {
    try {
      const [
        contractType,
        tokenName,
        tokenSymbol,
        supplyAmount,
        supplyStartIndex,
        saleStartTime,
        price,
        maxQuantityPerMint,
        mysteryBoxes,
        baseURIs,
        merkleTreeRoots,
        holdTokenAddresses,
      ] = contractParams;

      this.contractType = contractType;
      this.contractJSON = contracts[contractType];
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(
        this.contractJSON.abi,
        this.contractJSON.bytecode,
        signer
      );

      const contract = await factory.deploy(
        tokenName,
        tokenSymbol,
        supplyAmount, // phases supply
        supplyStartIndex, // phases supply start index
        saleStartTime, // phases sale start time
        price, // phases price in ETH
        maxQuantityPerMint, // max quantity per mint
        mysteryBoxes, // is mystery box enabled in phases
        baseURIs, // Base URIs for different phase token + unrevealedURI (if mystery box enabled)
        merkleTreeRoots, // Merkle Tree for different phase
        holdTokenAddresses // Address for NFT/Token Check
      );
      return contract.address;
    } catch (err) {
      errorHandler(err);
    }
  };

  getContractBalance = async (errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        contracts[this.contractType].abi,
        signer
      );
      await contract.balanceOfContract();
    } catch (err) {
      errorHandler(err);
    }
  };

  withdrawBalance = async (errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.withdraw();
    } catch (err) {
      errorHandler(err);
    }
  };

  flipIsSaleActive = async (errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.flipIsSaleActive();
    } catch (err) {
      errorHandler(err);
    }
  };

  flipToNextPhase = async (errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.flipToNextPhase();
    } catch (err) {
      errorHandler(err);
    }
  };

  flipMysteryBoxState = async (phaseIndex, baseURI, errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.flipMysteryBoxState(phaseIndex, baseURI);
    } catch (err) {
      errorHandler(err);
    }
  };

  setSaleStartTime = async (timestamp, phaseIndex, errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.setSaleStartTime(timestamp, phaseIndex);
    } catch (err) {
      errorHandler(err);
    }
  };

  setMerkleRoot = async (root, phaseIndex, errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.setMerkleRoot(root, phaseIndex);
    } catch (err) {
      errorHandler(err);
    }
  };

  reserveToken = async (phaseIndex, numOfReserveToken, errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.reserveToken(phaseIndex, numOfReserveToken);
    } catch (err) {
      errorHandler(err);
    }
  };

  mintToken = async (mintQuantity, proofs, price, errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.mint(mintQuantity, proofs, {
        value: (price * Math.pow(10, 18) * mintQuantity).toString(),
      });
    } catch (err) {
      errorHandler(err);
    }
  };

  getNowTokenId = async (errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      const res = await contract.nowTokenId();
      return res.toNumber();
    } catch (err) {
      errorHandler(err);
    }
  };

  getPhaseTokenSold = async (phaseIndex, errorHandler) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      const tokenSold = await contract.phaseTokenSold(phaseIndex);
      return tokenSold.toNumber();
    } catch (err) {
      errorHandler(err);
    }
  };
}
