// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarNFT {
    uint256 public constant MAX_CARS = 1000;
    uint256 public carPrice = 0.1 ether;
    uint256 private _tokenIds;
    address public owner;
    
    struct Car {
        uint256 speed;
        uint256 acceleration;
        uint256 handling;
        string color;
    }
    
    mapping(uint256 => Car) public cars;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event CarMinted(address indexed owner, uint256 indexed tokenId);
    
    constructor() {
        _tokenIds = 0;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    function mintCar(uint256 _speed, uint256 _acceleration, uint256 _handling, string memory _color) public payable {
        require(_tokenIds < MAX_CARS, "Maximum cars minted");
        require(msg.value >= carPrice, "Insufficient payment");
        require(_speed > 0 && _speed <= 10, "Speed must be between 1 and 10");
        require(_acceleration > 0 && _acceleration <= 10, "Acceleration must be between 1 and 10");
        require(_handling > 0 && _handling <= 10, "Handling must be between 1 and 10");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(msg.sender, newTokenId);
        
        cars[newTokenId] = Car({
            speed: _speed,
            acceleration: _acceleration,
            handling: _handling,
            color: _color
        });
        
        emit CarMinted(msg.sender, newTokenId);
    }
    
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "Mint to zero address");
        require(!_exists(tokenId), "Token already minted");
        
        _balances[to] += 1;
        _owners[tokenId] = to;
        
        emit Transfer(address(0), to, tokenId);
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }
    
    function getCarStats(uint256 tokenId) public view returns (uint256, uint256, uint256, string memory) {
        require(_exists(tokenId), "Car does not exist");
        Car memory car = cars[tokenId];
        return (car.speed, car.acceleration, car.handling, car.color);
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _owners[tokenId];
    }
    
    function balanceOf(address account) public view returns (uint256) {
        require(account != address(0), "Balance query for zero address");
        return _balances[account];
    }
    
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    function setCarPrice(uint256 newPrice) public onlyOwner {
        carPrice = newPrice;
    }
} 