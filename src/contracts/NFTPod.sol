// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // to use Ownable function
import "@openzeppelin/contracts/utils/Strings.sol"; // to use toString function
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol"; // to use MerkleProof.verify()
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // to use ReentrancyGuard, nonReentrant

contract NFTPod is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public currentPhase = 0;

    uint256 public immutable maxQuantityPerMint;
    uint256[] public phaseSupply;
    uint256[] public phaseSupplyStartIndex;
    uint256[] public phaseMintPrice;
    uint256[] public phaseTokenSold;
    bool[] public isPhaseActive;
    bool[] public isMysteryBoxRevealed;
    string[] public baseURIs;
    bytes32[] public phaseMerkleRoot;
    address[] public phaseNFTAddress;

    address payable public beneficiary; // company's address
    address public contractOwner; // contract's owner address
    uint256 public nowTokenId = 1; // tokenId start from 1

    /**
     * @notice Construct a NFTPod contract instance
     * @param name Token name
     * @param symbol Token symbol
     * @param _phaseSupply Supply for all phases, ex: [10, 20]
     * @param _phaseSupplyStartIndex Supply start index for all phases, ex: [1, 11]
     * @param _phaseMintPrice Mint price for all phases, ex: [1, 2, 3]
     * @param _maxQuantityPerMint Max Quantity allowed per single mintm ex: 5
     * @param _beneficiary Beneficiary address
     * @param isMysteryBoxEnabled Param to determine phase mystery box enabled, ex: [true, false, true]
     * @param _baseURIs Base token URIs for all phases, ex: ["ipfs:aaa", "ipfs:bbb", "ipfs:ccc"]
     * @param _phaseMerkleRoot Merkle roots for all phases
     * @param _phaseNFTAddress NFT address for all phases
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256[] memory _phaseSupply,
        uint256[] memory _phaseSupplyStartIndex,
        uint256[] memory _phaseMintPrice,
        uint256 _maxQuantityPerMint,
        address payable _beneficiary,
        bool[] memory isMysteryBoxEnabled,
        string[] memory _baseURIs,
        bytes32[] memory _phaseMerkleRoot,
        address[] memory _phaseNFTAddress
    ) ERC721(name, symbol) {
        for (uint256 i = 0; i < _phaseSupply.length; i++) {
            phaseSupply.push(_phaseSupply[i]);
            phaseSupplyStartIndex.push(_phaseSupplyStartIndex[i]);

            phaseMintPrice.push(_phaseMintPrice[i] * 1000000000000000000); // ether to wei
            isPhaseActive.push(false);
            isMysteryBoxRevealed.push(!isMysteryBoxEnabled[i]);
            baseURIs.push(_baseURIs[i]);
            phaseMerkleRoot.push(_phaseMerkleRoot[i]);
            phaseNFTAddress.push(_phaseNFTAddress[i]);
        }

        phaseTokenSold = new uint256[](_phaseSupply.length);

        maxQuantityPerMint = _maxQuantityPerMint;
        beneficiary = _beneficiary;
        contractOwner = msg.sender;
    }

    function getPhaseSupply() external view returns (uint256[] memory) {
        return phaseSupply;
    }

    function getMintPrice() external view returns (uint256[] memory) {
        return phaseMintPrice;
    }

    function getPhaseTokenSold()
        external
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return phaseTokenSold;
    }

    function getIsPhaseActive()
        external
        view
        onlyOwner
        returns (bool[] memory)
    {
        return isPhaseActive;
    }

    function getIsMysteryBoxRevealed()
        external
        view
        onlyOwner
        returns (bool[] memory)
    {
        return isMysteryBoxRevealed;
    }

    function getBaseURI() external view returns (string[] memory) {
        return baseURIs;
    }

    function getPhaseMerkleRoot()
        external
        view
        onlyOwner
        returns (bytes32[] memory)
    {
        return phaseMerkleRoot;
    }

    function getPhaseNFTAddress()
        external
        view
        onlyOwner
        returns (address[] memory)
    {
        return phaseNFTAddress;
    }

    function mint(uint256 mintNumber, bytes32[] calldata proof)
        public
        payable
        nonReentrant
    {
        // Gas optimization
        uint256 _nowTokenId = nowTokenId;

        require(
            isPhaseActive[currentPhase],
            "Sale must be active to mint token"
        );
        require(
            mintNumber <= maxQuantityPerMint,
            "Mint exceeded max quantity per mint"
        );
        require(
            (_nowTokenId + mintNumber) <=
                phaseSupply[currentPhase] + phaseSupplyStartIndex[currentPhase],
            "Purchase would exceed max supply of current phase"
        );
        require(
            phaseMintPrice[currentPhase] * mintNumber <= msg.value,
            "Ether value sent is not correct"
        );
        require(verifyAddress(proof), "INVALID_WHITELIST_PROOF");
        require(
            hasTokenOfAddress(msg.sender, currentPhase),
            "Must Own NFT to mint"
        );

        beneficiary.transfer((msg.value * 10) / 100); // transfer 10% to company
        payable(contractOwner).transfer((msg.value * 90) / 100); // transfer 90% to contract owner

        for (uint256 i = 1; i <= mintNumber; i++) {
            _safeMint(msg.sender, _nowTokenId + i);
        }
        nowTokenId += mintNumber;
    }

    function flipPhaseState(uint256 index) external onlyOwner {
        isPhaseActive[index] = !isPhaseActive[index];
        phaseTokenSold[currentPhase] = nowTokenId;
        currentPhase = index;
        if (nowTokenId != phaseSupplyStartIndex[currentPhase]) {
            // shift token to next phase
            nowTokenId = phaseSupplyStartIndex[currentPhase];
        }
    }

    function flipMysteryBoxState(uint256 index) external onlyOwner {
        isMysteryBoxRevealed[index] = !isMysteryBoxRevealed[index];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string
            memory unrevealedURI = "ipfs://Qmb6ri3QpTHJxXpwTeVf5PLPP4YXBzmu753Nsb71ZCkiDo";

        for (uint256 i = 0; i < phaseSupply.length; i++) {
            if (
                tokenId >= phaseSupplyStartIndex[i] &&
                tokenId <= (phaseSupplyStartIndex[i] + phaseSupply[i]) &&
                isMysteryBoxRevealed[i]
            ) {
                return
                    string(abi.encodePacked(baseURIs[i], tokenId.toString()));
            }
        }

        return unrevealedURI;
    }

    function reserveToken(uint256 phaseIndex, uint256 numOfReserveToken)
        external
        onlyOwner
    {
        require(isPhaseActive[phaseIndex], "Sale must be active to mint token");

        // update current phase token sold to avoid minting minted token
        phaseTokenSold[currentPhase] = nowTokenId;

        // check if reserve exceed phase supply
        uint256 startIndex = phaseTokenSold[phaseIndex];
        uint256 endIndex = startIndex + numOfReserveToken;
        require(
            endIndex <=
                phaseSupplyStartIndex[phaseIndex] + phaseSupply[phaseIndex],
            "Reserve would exceed phase supply"
        );

        for (uint256 i = startIndex; i < endIndex; i++) {
            _safeMint(msg.sender, i);
        }

        // update token sold after reserving token
        phaseTokenSold[phaseIndex] = endIndex;

        // update token id after reserving token
        if (phaseIndex == currentPhase) {
            nowTokenId += numOfReserveToken;
        }
    }

    function setMerkleRoot(bytes32 _merkleRoot, uint256 index)
        external
        onlyOwner
    {
        phaseMerkleRoot[index] = _merkleRoot;
    }

    function verifyAddress(bytes32[] calldata proof)
        public
        view
        returns (bool)
    {
        return
            MerkleProof.verify(
                proof,
                phaseMerkleRoot[currentPhase],
                keccak256(abi.encodePacked(msg.sender))
            );
    }

    function hasTokenOfAddress(address user, uint256 index)
        public
        view
        returns (bool)
    {
        ERC721 contractInstance = ERC721(phaseNFTAddress[index]);
        return (contractInstance.balanceOf(user) > 0);
    }

    // ERC721 Enumerable
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
