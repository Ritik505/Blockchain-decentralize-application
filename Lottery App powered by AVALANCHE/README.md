# Blockchain Lottery Application Powered by Avalanche

This is a React-based implementation of a decentralized lottery application built on Avalanche (AVAX). The application allows users to participate in a lottery game where they can buy tickets, select numbers, and determine a winner using smart contracts.

## Features

- Connect to Avalanche blockchain via MetaMask
- Enter participants for the lottery
- Buy lottery tickets (0.2 AVAX each)
- Select numbers for each participant
- Determine a winner based on smart contract logic
- View lottery contract balance and game state
- Prize distribution:
  - Winner receives 0.5 AVAX
  - Manager receives 0.1 AVAX
  - If no winner, manager receives all 0.6 AVAX

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Access to Avalanche network (MainNet, TestNet, or local development network)

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd lottery-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Serve the production build:
   ```
   npm run server
   ```

## How to Play

1. Connect your MetaMask wallet to the Avalanche network
2. Enter three participant Avalanche addresses
3. Start the game
4. Each participant must buy a ticket (costs 0.2 AVAX)
5. After all tickets are purchased, participants select their numbers
6. When all numbers are selected, the winner can be determined
7. The prize pool is distributed:
   - Winner receives 0.5 AVAX
   - Manager receives 0.1 AVAX
   - If no winner, manager receives all 0.6 AVAX

## Smart Contract

The application interacts with a lottery smart contract deployed on the Avalanche blockchain. The contract handles:

- Participant registration
- Ticket purchases
- Number selection
- Winner determination and prize distribution

## Technology Stack

- React.js - Frontend framework
- Web3.js - Ethereum JavaScript API
- Express - Node.js web server
- CRACO - Create React App Configuration Override

## License

This project is licensed under the MIT License.

## Acknowledgments

- Original blockchain lottery application concept
