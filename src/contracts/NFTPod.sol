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

    bool public isSaleActive = true;
    uint256 public currentPhase = 0;
    uint256 public nowTokenId = 1; // tokenId start from 1

    address payable public beneficiary =
        payable(0xE29FA9849e35F96d89AA1C40Ffb5ab8F28272FF4); // beneficiary's address
    address payable public contractOwner; // contract's owner address

    uint256 public immutable maxQuantityPerMint;
    uint256[] public phaseSupply;
    uint256[] public phaseSupplyStartIndex;
    uint256[] public phaseMintPrice;
    uint256[] public phaseTokenSold;
    uint256[] public phaseSaleStartTime;
    bool[] public isMysteryBoxRevealed;
    string[] public baseURIs;
    bytes32[] public phaseMerkleRoot;
    address[] public phaseNFTAddress;
    string unrevealedURI;

    /**
     * @notice Construct a NFTPod contract instance
     * @param name Token name
     * @param symbol Token symbol
     * @param _phaseSupply Supply for all phases, ex: [10, 20]
     * @param _phaseSupplyStartIndex Supply start index for all phases, ex: [1, 11]
     * @param _phaseSaleStartTime Phase sale start time
     * @param _phaseMintPrice Mint price for all phases, ex: [1, 2, 3]
     * @param _maxQuantityPerMint Max quantity allowed per single mint ex: 5
     * @param isMysteryBoxEnabled Param to determine phase mystery box enabled, ex: [true, false, true]
     * @param _baseURIs Base token URIs for all phases + unrevealedURI, ex: ["ipfs:aaa", "ipfs:bbb", "ipfs:ccc", "ipfs:unrevealed"]
     * @param _phaseMerkleRoot Merkle roots for all phases
     * @param _phaseNFTAddress NFT address for all phases
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256[] memory _phaseSupply,
        uint256[] memory _phaseSupplyStartIndex,
        uint256[] memory _phaseSaleStartTime,
        uint256[] memory _phaseMintPrice,
        uint256 _maxQuantityPerMint,
        bool[] memory isMysteryBoxEnabled,
        string[] memory _baseURIs,
        bytes32[] memory _phaseMerkleRoot,
        address[] memory _phaseNFTAddress
    ) ERC721(name, symbol) {
        for (uint256 i = 0; i < _phaseSupply.length; i++) {
            phaseSupply.push(_phaseSupply[i]);
            phaseSupplyStartIndex.push(_phaseSupplyStartIndex[i]);
            phaseMintPrice.push(_phaseMintPrice[i] * 1000000000000000000); // ether to wei
            phaseSaleStartTime.push(_phaseSaleStartTime[i]);
            isMysteryBoxRevealed.push(!isMysteryBoxEnabled[i]);
            baseURIs.push(_baseURIs[i]);
            phaseMerkleRoot.push(_phaseMerkleRoot[i]);
            phaseNFTAddress.push(_phaseNFTAddress[i]);
        }

        // unrevealedURI is at _baseURIs last value
        unrevealedURI = _baseURIs[_baseURIs.length - 1];
        phaseTokenSold = new uint256[](_phaseSupply.length);
        maxQuantityPerMint = _maxQuantityPerMint;
        contractOwner = payable(msg.sender);
    }

    function mint(uint256 mintNumber, bytes32[] calldata proof)
        public
        payable
        nonReentrant
    {
        // Gas optimization
        uint256 _nowTokenId = nowTokenId;

        require(isSaleActive, "Sale not active");
        require(
            block.timestamp > phaseSaleStartTime[currentPhase],
            "Sale not started"
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
        require(isValidMerkleProof(proof), "Invalid whitelist proof");
        // require(
        //     hasTokenOfAddress(msg.sender, currentPhase),
        //     "Must Own NFT to mint"
        // );

        for (uint256 i = 0; i < mintNumber; i++) {
            _safeMint(msg.sender, _nowTokenId + i);
        }
        nowTokenId += mintNumber;

        // return over paid ether
        if (msg.value > phaseMintPrice[currentPhase] * mintNumber) {
            Address.sendValue(
                payable(msg.sender),
                msg.value - phaseMintPrice[currentPhase] * mintNumber
            );
        }
    }

    function flipIsSaleActive() external onlyOwner {
        isSaleActive = !isSaleActive;
    }

    function flipToNextPhase() external onlyOwner {
        require(
            currentPhase + 1 < phaseSupply.length,
            "Already at final phase"
        );
        phaseTokenSold[currentPhase] =
            nowTokenId -
            phaseSupplyStartIndex[currentPhase];
        currentPhase += 1;
        if (nowTokenId != phaseSupplyStartIndex[currentPhase]) {
            // shift token to next phase
            nowTokenId = phaseSupplyStartIndex[currentPhase];
        }
    }

    function flipMysteryBoxState(uint256 index, string memory _uri)
        external
        onlyOwner
    {
        if (isMysteryBoxRevealed[index] == false) {
            isMysteryBoxRevealed[index] = true;
            baseURIs[index] = _uri;
        }
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

        for (uint256 i = 0; i < phaseSupply.length; i++) {
            if (
                tokenId >= phaseSupplyStartIndex[i] &&
                tokenId < (phaseSupplyStartIndex[i] + phaseSupply[i]) &&
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
        if (phaseIndex == currentPhase) {
            // update token to avoid minting minted tokens
            phaseTokenSold[currentPhase] =
                nowTokenId -
                phaseSupplyStartIndex[currentPhase];
        }

        // start index = start index + token sold
        uint256 startIndex = phaseSupplyStartIndex[phaseIndex] +
            phaseTokenSold[phaseIndex];
        uint256 endIndex = startIndex + numOfReserveToken;
        // check if reserve exceed phase supply
        require(
            endIndex <=
                phaseSupplyStartIndex[phaseIndex] + phaseSupply[phaseIndex],
            "Reserve would exceed phase supply"
        );

        for (uint256 i = startIndex; i < endIndex; i++) {
            _safeMint(msg.sender, i);
        }

        // update token sold after reserving token
        phaseTokenSold[phaseIndex] += numOfReserveToken;

        if (phaseIndex == currentPhase) {
            nowTokenId += numOfReserveToken;
        }
    }

    function withdraw() external nonReentrant {
        require(
            msg.sender == beneficiary || msg.sender == contractOwner,
            "Only beneficiary and contract owner allowed."
        );
        uint256 balance = address(this).balance;
        Address.sendValue(beneficiary, (balance * 10) / 100);
        Address.sendValue(contractOwner, (balance * 90) / 100);
    }

    function balanceOfContract() external view returns (uint256) {
        require(
            msg.sender == beneficiary || msg.sender == contractOwner,
            "Only beneficiary and contract owner allowed."
        );
        return address(this).balance;
    }

    function setSaleStartTime(uint256 timestamp, uint256 index)
        external
        onlyOwner
    {
        require(
            block.timestamp < phaseSaleStartTime[index],
            "Not allowed to set already started sale"
        );
        phaseSaleStartTime[index] = timestamp;
    }

    function setMerkleRoot(bytes32 _merkleRoot, uint256 index)
        external
        onlyOwner
    {
        phaseMerkleRoot[index] = _merkleRoot;
    }

    function isValidMerkleProof(bytes32[] calldata proof)
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
