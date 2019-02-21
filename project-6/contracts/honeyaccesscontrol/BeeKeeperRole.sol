pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'BeeKeeperRole' to manage this role - add, remove, check
contract BeeKeeperRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event BeeKeeperAdded(address indexed account);
    event BeeKeeperRemoved(address indexed account);

    string private constant ERROR_IS_NOT_BEEKEEPER = "ERROR_IS_NOT_BEEKEEPER";

    // Define a struct 'beeKeepers' by inheriting from 'Roles' library, struct Role
    Roles.Role private beeKeepers;

    // In the constructor make the address that deploys this contract the 1st beeKeeper
    constructor() public {
        _addBeeKeeper(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyBeeKeeper() {
        require(isBeeKeeper(msg.sender), ERROR_IS_NOT_BEEKEEPER);
        _;
    }

    // Define a function 'isBeeKeeper' to check this role
    function isBeeKeeper(address account) public view returns (bool) {
        return beeKeepers.has(account);
    }

    // Define a function 'addBeeKeeper' that adds this role
    function addBeeKeeper(address account) public onlyBeeKeeper {
        _addBeeKeeper(account);
    }

    // Define a function 'renounceBeeKeeper' to renounce this role
    function renounceBeeKeeper() public {
        _removeBeeKeeper(msg.sender);
    }

    // Define an internal function '_addBeeKeeper' to add this role, called by 'addBeeKeeper'
    function _addBeeKeeper(address account) internal {
        beeKeepers.add(account);
        emit BeeKeeperAdded(account);
    }

    // Define an internal function '_removeBeeKeeper' to remove this role, called by 'removeBeeKeeper'
    function _removeBeeKeeper(address account) internal {
        beeKeepers.remove(account);
        emit BeeKeeperRemoved(account);
    }
}