import { ethers } from "ethers";
import contractJSON0 from "../abis/NFTPod0.json";
import contractJSON1 from "../abis/NFTPod1.json";
import contractJSON2 from "../abis/NFTPod2.json";
import contractJSON3 from "../abis/NFTPod3.json";
import contractJSON4 from "../abis/NFTPod4.json";
import contractJSON5 from "../abis/NFTPod5.json";
import contractJSON6 from "../abis/NFTPod6.json";
import contractJSON7 from "../abis/NFTPod7.json";
import ERC20JSON from "../abis/ERC721.json";

const contracts = {
  0: contractJSON0,
  1: contractJSON1,
  2: contractJSON2,
  3: contractJSON3,
  4: contractJSON4,
  5: contractJSON5,
  6: contractJSON6,
  7: contractJSON7,
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

  deployContract = async (contractType, contractParams, errorHandler) => {
    try {
      this.contractType = contractType;
      this.contractJSON = contracts[contractType];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(
        this.contractJSON.abi,
        this.contractJSON.bytecode,
        signer
      );

      const contract = await factory.deploy(...contractParams);
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
        this.contractJSON.abi,
        signer
      );
      const balance = await contract.balanceOfContract();
      return ethers.utils.formatEther(balance);
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
      await contract.setPhaseSaleStartTime(timestamp, phaseIndex);
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

  mintToken = async (
    mintQuantity,
    price,
    errorHandler,
    proofs = [
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ]
  ) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        this.address,
        this.contractJSON.abi,
        signer
      );

      const contractWithWhitelist = [0, 1, 2, 4];
      const priceInWei = ethers.utils.parseEther(price);
      if (contractWithWhitelist.includes(this.contractType)) {
        await contract.mint(mintQuantity, proofs, {
          value: (priceInWei * mintQuantity).toString(),
        });
      } else {
        await contract.mint(mintQuantity, {
          value: (priceInWei * mintQuantity).toString(),
        });
      }
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

  hasTokenOfContract = async (senderAddress, contractAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      ERC20JSON.abi,
      provider
    );
    const ownedToken = await contract.balanceOf(senderAddress);
    return ownedToken.toNumber() > 0;
  };
}
