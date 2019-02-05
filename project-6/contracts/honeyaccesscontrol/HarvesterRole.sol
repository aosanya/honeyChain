pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'HarvesterRole' to manage this role - add, remove, check
contract BeeKeeperRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event HarvesterAdded(address indexed account);
    event HarvesterRemoved(address indexed account);

    // Define a struct 'harvesters' by inheriting from 'Roles' library, struct Role
    Roles.Role private harvesters;

    // In the constructor make the address that deploys this contract the 1st harvester
    constructor() public {
        _addHarvester(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyHarvester() {
        require(isHarvester(msg.sender), "Is not Harvester");
        _;
    }

    // Define a function 'isHarvester' to check this role
    function isHarvester(address account) public view returns (bool) {
        return harvesters.has(account);
    }

    // Define a function 'addHarvester' that adds this role
    function addHarvester(address account) public onlyHarvester {
        _addHarvester(account);
    }

    // Define a function 'renounceHarvester' to renounce this role
    function renounceHarvester() public {
        _removeHarvester(msg.sender);
    }

    // Define an internal function '_addHarvester' to add this role, called by 'addHarvester'
    function _addHarvester(address account) internal {
        harvesters.add(account);
        emit HarvesterAdded(account);
    }

    // Define an internal function '_removeHarvester' to remove this role, called by 'removeHarvester'
    function _removeHarvester(address account) internal {
        harvesters.remove(account);
        emit HarvesterRemoved(account);
    }
}