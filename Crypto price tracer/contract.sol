// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract CryptoPriceFeed {
    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal btcPriceFeed;

    
    constructor() {
        ethPriceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        btcPriceFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    
    function getLatestETHPrice() public view returns (int) {
        (, int answer, , , ) = ethPriceFeed.latestRoundData();
        return answer;
    }

    
    function getLatestBTCPrice() public view returns (int) {
        (, int answer, , , ) = btcPriceFeed.latestRoundData();
        return answer;
    }
}
