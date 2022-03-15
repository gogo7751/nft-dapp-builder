import { ethers } from 'ethers';
import contractJSON from '../abis/NFTPod.json';

const beneficiaryAddress = '0x67a39FcA0AE0785AbCD90FA579D51a93D222D475';
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

class ContractService {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  contractJSON = {};
  address = '';

  isConnectedNetworkMatch = async (networkId) => {
    const signer = this.provider.getSigner();
    const chainId = await signer.getChainId();
    return chainId === networkId;
  };

  deployContract = async (contractParams, errorHandler) => {
    try {
      const [
        contractType,
        tokenName,
        tokenSymbol,
        supplyAmount,
        supplyStartIndex,
        price,
        maxQuantityPerMint,
        mysteryBoxes,
        baseURIs,
        merkleTreeRoots,
        holdTokenAddresses,
      ] = contractParams;

      this.contractJSON = contracts[contractType];
      const signer = this.provider.getSigner();
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
        price, // phases price in ETH
        maxQuantityPerMint, // max quantity per mint
        beneficiaryAddress, // beneficiary/company's address
        mysteryBoxes, // is mystery box enabled in phases
        baseURIs, // Base URIs for different phase token
        merkleTreeRoots, // Merkle Tree for different phase
        holdTokenAddresses // Address for NFT/Token Check
      );
      return contract.address;
    } catch (err) {
      errorHandler(err);
    }
  };

  flipPhaseState = async (phaseIndex, errorHandler) => {
    try {
      const signer = this.provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.flipPhaseState(phaseIndex);
    } catch (err) {
      errorHandler(err);
    }
  };

  flipMysteryBoxState = async (phaseIndex, errorHandler) => {
    try {
      const signer = this.provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );
      await contract.flipMysteryBoxState(phaseIndex);
    } catch (err) {
      errorHandler(err);
    }
  };

  setMerkleRoot = async (root, phaseIndex, errorHandler) => {
    try {
      const signer = this.provider.getSigner();
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
      const signer = this.provider.getSigner();
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
    // const senderHashedAddress = keccak256(account);
    // const proofs = merkleTree.getProof(senderHashedAddress);
    // var proofArray = [];
    // if (proofs !== []) {
    //   for (let i = 0; i < proofs.length; i++) {
    //     proofArray.push(proofs[i]['data']);
    //   }
    // } else {
    //   proofArray.push('');
    // }

    try {
      const signer = this.provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        contractJSON.abi,
        signer
      );
      await contract.mint(mintQuantity, proofs, {
        value: (price * Math.pow(10, 18) * mintQuantity).toString(),
      });
    } catch (err) {
      errorHandler(err);
    }
  };
}

export default new ContractService();
