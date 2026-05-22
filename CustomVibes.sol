// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title CustomVibes — user-defined NFTs with on-chain name/description/image
contract CustomVibes is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public totalMinted;

    struct TokenData {
        string name;
        string description;
        string imageURI;
        address creator;
    }

    mapping(uint256 => TokenData) private _tokenData;

    event CustomMinted(address indexed to, uint256 tokenId, string name);

    constructor() ERC721("Arc Custom Vibes", "CVIBE") Ownable(msg.sender) {}

    function mintCustom(
        address to,
        string calldata name,
        string calldata description,
        string calldata imageURI
    ) external {
        require(totalMinted < MAX_SUPPLY, "Max supply reached");
        require(bytes(name).length > 0, "Name required");
        require(bytes(imageURI).length > 0, "Image URI required");
        unchecked { totalMinted++; }
        _safeMint(to, totalMinted);
        _tokenData[totalMinted] = TokenData(name, description, imageURI, msg.sender);
        emit CustomMinted(to, totalMinted, name);
    }

    function getTokenData(uint256 tokenId)
        external view
        returns (string memory name, string memory description, string memory imageURI, address creator)
    {
        _requireOwned(tokenId);
        TokenData memory d = _tokenData[tokenId];
        return (d.name, d.description, d.imageURI, d.creator);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        TokenData memory d = _tokenData[tokenId];
        // Simple on-chain JSON — no external hosting needed
        return string(abi.encodePacked(
            'data:application/json;utf8,{"name":"', d.name,
            '","description":"', d.description,
            '","image":"', d.imageURI, '"}'
        ));
    }
}
