// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "base64-sol/base64.sol";


contract NFTicketer is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    struct eventStruct {
        string title;
        string description;
        string date;
        string cid;
        uint minted;
        uint max;
        uint startID;
        address owner;
    }

    struct tokenStruct {
        uint256 id;
        address owner;
        uint256 tokenId;
    }

    Counters.Counter private eCount;

    mapping(uint256 => eventStruct) public events;
    mapping(uint256 => tokenStruct) public tokens;
    
    event Created(address owner, uint256 eventId);
    event Minted(address sender, uint256 tokenId);

    constructor() ERC721("NFTTicketer", "NTICKET") public{}

    // Create a new event
    function create(string memory _title, string memory _description, string memory _date, string memory _cid, uint _total) public{
        uint256 startingID = 1;

        uint currentId = eCount.current();

        if (currentId > 0) {
            startingID = events[currentId].startID + events[currentId].max;
        }

        eCount.increment();

        events[currentId] = eventStruct( {
            title: _title, 
            description: _description,
            date: _date,
            cid: _cid,
            minted: 0,
            max: _total,
            startID: startingID,
            owner: msg.sender
        });
    
        emit Created(msg.sender, currentId);
    }

    // Mint a new token
    function mint(uint256 _id) public payable returns (uint256){   
        require(events[_id].max > 0, "Invalid Event");
        require(events[_id].minted < events[_id].max, "Already Jampacked");

        uint256 tokenId = events[_id].startID + events[_id].minted;
        events[_id].minted += 1;

        tokens[tokenId] = tokenStruct( {
            id: _id,
            tokenId: tokenId,
            owner: msg.sender
        });
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, generateTokenURI(events[_id].title, events[_id].description, events[_id].date, events[_id].cid));

        emit Minted(msg.sender, tokenId);
        return tokenId;
    }

    // Verify if a token is owned by the caller
    function verify(address owner, uint256 tokenId) public view returns (bool){
        if(tokens[tokenId].owner == owner){
            return true;
        }
        else{
            return false;
        }
    }

    // Generate the token URI
    function generateTokenURI(string memory title, string memory description, string memory date, string memory cid) public pure returns(string memory){
        return string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',title,' NFTicket", ',
                                '"description":"',description,'", ',
                                '"attributes":['
                                '{"trait_type":"Date","value":"',date,'"}, ',
                                '"image":"https://gateway.pinata.cloud/ipfs/',cid,'"}'
                            )
                        )
                    )
                )
            );
    }
}

