// migrating the appropriate contracts
var AccessControl = artifacts.require("./AccessControl");
var SupplyChain = artifacts.require("./SupplyChain");

module.exports = function(deployer) {
  deployer.deploy(AccessControl);
  deployer.deploy(SupplyChain);
};
