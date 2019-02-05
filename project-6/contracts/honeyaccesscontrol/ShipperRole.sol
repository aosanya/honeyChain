pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ShipperRole' to manage this role - add, remove, check
contract ShipperRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event ShipperAdded(address indexed account);
    event ShipperRemoved(address indexed account);

    // Define a struct 'shippers' by inheriting from 'Roles' library, struct Role
    Roles.Role private shippers;

    // In the constructor make the address that deploys this contract the 1st shipper
    constructor() public {
        _addShipper(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyShipper() {
        require(isShipper(msg.sender), "Is not Shipper");
        _;
    }

    // Define a function 'isShipper' to check this role
    function isShipper(address account) public view returns (bool) {
        return shippers.has(account);
    }

    // Define a function 'addShipper' that adds this role
    function addShipper(address account) public onlyShipper {
        _addShipper(account);
    }

    // Define a function 'renounceShipper' to renounce this role
    function renounceShipper() public {
        _removeShipper(msg.sender);
    }

    // Define an internal function '_addShipper' to add this role, called by 'addShipper'
    function _addShipper(address account) internal {
        shippers.add(account);
        emit ShipperAdded(account);
    }

    // Define an internal function '_removeShipper' to remove this role, called by 'removeShipper'
    function _removeShipper(address account) internal {
        shippers.remove(account);
        emit ShipperRemoved(account);
    }
}