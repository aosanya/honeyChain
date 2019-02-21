// migrating the appropriate contracts
var AccessControl = artifacts.require("./AccessControl");
var BeeKeeperRole = artifacts.require("./BeeKeeperRole");
var HarvesterRole = artifacts.require("./HarvesterRole");
var ShipperRole = artifacts.require("./ShipperRole");
var BuyerRole = artifacts.require("./BuyerRole");
var SupplyChain = artifacts.require("./SupplyChain");

module.exports = function(deployer) {
  deployer.deploy(AccessControl);
  // deployer.deploy(BeeKeeperRole);
  // deployer.deploy(HarvesterRole);
  // deployer.deploy(ShipperRole);
  // deployer.deploy(BuyerRole);
  deployer.deploy(SupplyChain);
};
