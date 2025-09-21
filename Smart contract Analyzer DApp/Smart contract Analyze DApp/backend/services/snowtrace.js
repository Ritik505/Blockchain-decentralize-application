const axios = require('axios');

class EtherscanService {
  constructor() {
    this.baseUrl = ''; 
    
    this.apiKey = ''; 
  }

  async fetchContractFromEtherscan(contractAddress) {
    try {
      console.log(`Fetching contract source code from Etherscan: ${contractAddress}`);
      
      const sourceCodeUrl = `${this.baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}`;
      const params = { apikey: this.apiKey }; 

      const response = await axios.get(sourceCodeUrl, { params });
      
      if (response.data.status === '1' && response.data.result && response.data.result[0]) {
        const contract = response.data.result[0];
        
        if (contract.SourceCode && contract.SourceCode !== '') {
          console.log('Contract source code found');
          return contract.SourceCode;
        } else {
          console.log('Contract not verified or no source code available');
          return null;
        }
      } else {
        console.log('Contract not found on Etherscan or API error:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching from Etherscan:', error.message);
      return null;
    }
  }

  async getContractInfo(contractAddress) {
    try {
      console.log(`Fetching contract info from Etherscan: ${contractAddress}`);
      const url = `${this.baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}`;
      const params = { apikey: this.apiKey };

      const response = await axios.get(url, { params });
      
      if (response.data.status === '1' && response.data.result && response.data.result[0]) {
        const contract = response.data.result[0];
        return {
          contractName: contract.ContractName || 'Unknown',
          compilerVersion: contract.CompilerVersion || 'Unknown',
          optimizationUsed: contract.OptimizationUsed || 'Unknown',
          runs: contract.Runs || 'Unknown',
          constructorArguments: contract.ConstructorArguments || '',
          evmVersion: contract.EVMVersion || 'Unknown',
          licenseType: contract.LicenseType || 'Unknown',
          proxy: contract.Proxy === '1',
          implementation: contract.Implementation || '',
          swarmSource: contract.SwarmSource || ''
        };
      }
      console.log('Contract info not found on Etherscan or API error.');
      return null;
    } catch (error) {
      console.error('Error fetching contract info:', error.message);
      return null;
    }
  }

  async getContractABI(contractAddress) {
    try {
      console.log(`Fetching contract ABI from Etherscan: ${contractAddress}`);
      const url = `${this.baseUrl}?module=contract&action=getabi&address=${contractAddress}`;
      const params = { apikey: this.apiKey };
      
      const response = await axios.get(url, { params });
      
      if (response.data.status === '1' && response.data.result) {
        return JSON.parse(response.data.result);
      }
      console.log('Contract ABI not found on Etherscan or API error.');
      return null;
    } catch (error) {
      console.error('Error fetching contract ABI:', error.message);
      return null;
    }
  }

  async getContractBytecode(contractAddress) {
    try {
      console.log(`Fetching contract bytecode from Etherscan: ${contractAddress}`);
      const url = `${this.baseUrl}?module=proxy&action=eth_getCode&address=${contractAddress}&tag=latest`;
      const params = { apikey: this.apiKey };
      
      const response = await axios.get(url, { params });
      
      if (response.data.result) {
        return response.data.result;
      }
      console.log('Contract bytecode not found or API error.');
      return null;
    } catch (error) {
      console.error('Error fetching contract bytecode:', error.message);
      return null;
    }
  }

  async verifyContractExists(contractAddress) {
    try {
      console.log(`Verifying contract existence on Etherscan: ${contractAddress}`);
      const bytecode = await this.getContractBytecode(contractAddress);
      return bytecode && bytecode !== '0x';
    } catch (error) {
      console.error('Error verifying contract existence:', error.message);
      return false;
    }
  }
}

module.exports = {
  fetchContractFromEtherscan: async (contractAddress) => {
    const etherscan = new EtherscanService();
    return await etherscan.fetchContractFromEtherscan(contractAddress);
  },
  
  getContractInfo: async (contractAddress) => {
    const etherscan = new EtherscanService();
    return await etherscan.getContractInfo(contractAddress);
  },
  
  getContractABI: async (contractAddress) => {
    const etherscan = new EtherscanService();
    return await etherscan.getContractABI(contractAddress);
  },
  
  verifyContractExists: async (contractAddress) => {
    const etherscan = new EtherscanService();
    return await etherscan.verifyContractExists(contractAddress);
  }
};
