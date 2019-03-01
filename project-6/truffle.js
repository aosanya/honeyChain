
var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'spirit supply whale amount human item harsh scare congress discover talent hamster';

module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 9545,
    //   network_id: "*" // Match any network id
    // },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/2ab7f19326de4b05a5ce245c0e547f71')
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    },
    compilers: {
      solc: {
        version: "0.4.24"  // ex:  "0.4.20". (Default: Truffle's installed solc)
      }
    }

  }

};