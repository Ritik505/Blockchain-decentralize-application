// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LotteryContract {
    address public manager;
    address[3] public participants;
    mapping(address => bool) public hasParticipated;
    mapping(address => bool) public hasPaidTicket;
    mapping(address => uint8) public selectedNumbers;
    
    uint8 private availableNumbers = 15; 
    uint8 public participantCount = 0;
    uint8 public ticketPurchaseCount = 0;
    uint8 public numberSelectionCount = 0;
    bool public gameStarted = false;
    bool public gameEnded = false;
    
    address public winner;
    uint8 public winningNumber;
    
    event ParticipantAdded(address participant, uint8 index);
    event TicketPurchased(address participant);
    event NumberSelected(address participant, uint8 number);
    event WinnerDeclared(address winner, uint8 winningNumber, uint256 prize);
    event FundsTransferred(address recipient, uint256 amount);
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }
    
    modifier gameInProgress() {
        require(gameStarted && !gameEnded, "Game is not in progress");
        _;
    }
    
    constructor() {
        manager = SET MANAGER ADDRESS;
    }
    
    function startGame(address[3] memory _participants) external onlyManager {
        require(!gameStarted, "Game already started");
        require(_participants[0] != address(0) && _participants[1] != address(0) && _participants[2] != address(0), "Invalid participant addresses");
        
        resetGame();
        
        for (uint8 i = 0; i < 3; i++) {
            participants[i] = _participants[i];
            hasParticipated[_participants[i]] = true;
            participantCount++;
            emit ParticipantAdded(_participants[i], i);
        }
        
        gameStarted = true;
    }
    
    function buyTicket() external payable gameInProgress {
        require(hasParticipated[msg.sender], "Not a participant");
        require(!hasPaidTicket[msg.sender], "Already purchased a ticket");
        require(msg.value == 5 ether, "Ticket price is 5 ether");
        
        hasPaidTicket[msg.sender] = true;
        ticketPurchaseCount++;
        
        emit TicketPurchased(msg.sender);
    }
    
    function selectNumber(uint8 number) external gameInProgress {
        require(hasParticipated[msg.sender], "Not a participant");
        require(hasPaidTicket[msg.sender], "Ticket not purchased");
        require(selectedNumbers[msg.sender] == 0, "Already selected a number");
        require(number >= 1 && number <= 4, "Number must be between 1 and 4");
        require(isNumberAvailable(number), "Number already selected");
        
        selectedNumbers[msg.sender] = number;
        numberSelectionCount++;
        
        emit NumberSelected(msg.sender, number);
    }
    
    function determineWinner() external onlyManager gameInProgress {
        require(ticketPurchaseCount == 3, "Not all tickets purchased");
        require(numberSelectionCount == 3, "Not all numbers selected");
        
        uint8 randomNumber = generateRandomNumber();
        winningNumber = randomNumber;
        
        address winnerAddress = address(0);
        for (uint8 i = 0; i < 3; i++) {
            if (selectedNumbers[participants[i]] == randomNumber) {
                winnerAddress = participants[i];
                break;
            }
        }
        
        winner = winnerAddress;
        distributeWinnings(winnerAddress);
        gameEnded = true;
        
        emit WinnerDeclared(winnerAddress, randomNumber, winnerAddress != address(0) ? 12 ether : 0);
    }
    
    function isNumberAvailable(uint8 number) public view returns (bool) {
        for (uint8 i = 0; i < 3; i++) {
            if (selectedNumbers[participants[i]] == number) {
                return false;
            }
        }
        return true;
    }
    
    function getAvailableNumbers() public view returns (uint8[] memory) {
        uint8[] memory available = new uint8[](4);
        uint8 count = 0;
        
        for (uint8 i = 1; i <= 4; i++) {
            if (isNumberAvailable(i)) {
                available[count] = i;
                count++;
            }
        }
        
        uint8[] memory result = new uint8[](count);
        for (uint8 i = 0; i < count; i++) {
            result[i] = available[i];
        }
        
        return result;
    }
    
    function getParticipantNumber(address participant) public view returns (uint8) {
        return selectedNumbers[participant];
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function distributeWinnings(address winnerAddress) private {
        if (winnerAddress != address(0)) {
         
            payable(winnerAddress).transfer(12 ether);
            payable(manager).transfer(3 ether);
            
            emit FundsTransferred(winnerAddress, 12 ether);
            emit FundsTransferred(manager, 3 ether);
        } else {
            payable(manager).transfer(address(this).balance);
            
            emit FundsTransferred(manager, 15 ether);
        }
    }
    
    function resetGame() private {

        for (uint8 i = 0; i < 3; i++) {
            if (participants[i] != address(0)) {
                hasParticipated[participants[i]] = false;
                hasPaidTicket[participants[i]] = false;
                selectedNumbers[participants[i]] = 0;
                participants[i] = address(0);
            }
        }
        
        participantCount = 0;
        ticketPurchaseCount = 0;
        numberSelectionCount = 0;
        gameStarted = false;
        gameEnded = false;
        winner = address(0);
        winningNumber = 0;
    }
    
    function generateRandomNumber() private view returns (uint8) {
        uint8 randomNumber = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants))) % 4) + 1;
        return randomNumber;
    }
} 