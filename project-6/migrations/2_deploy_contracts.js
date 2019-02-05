// migrating the appropriate contracts
var BeeKeeperRole = artifacts.require("./BeeKeeperRole.sol");
var HarvesterRole = artifacts.require("./HarvesterRole.sol");
var ShipperRole = artifacts.require("./ShipperRole.sol");
var BuyerRole = artifacts.require("./BuyerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(BeeKeeperRole);
  deployer.deploy(HarvesterRole);
  deployer.deploy(ShipperRole);
  deployer.deploy(BuyerRole);
  deployer.deploy(SupplyChain);
};
