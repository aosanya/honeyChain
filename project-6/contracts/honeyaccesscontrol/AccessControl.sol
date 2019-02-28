pragma solidity ^0.4.24;

// Define a contract 'Supplychain'
contract AccessControl{
    mapping (bytes32 => bool) internal roles;
    mapping (bytes32 => bool) internal permissions;

    bytes32 public constant HARVEST_ROLE = keccak256("HARVEST_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant SHIPPER_ROLE = keccak256("SHIPPER_ROLE");
    bytes32 public constant BEEKEEPER_ROLE = keccak256("BEEKEEPER_ROLE");
    bytes32 public constant HARVESTER_OF_ROLE = keccak256("HARVEST_OF_ROLE");
    bytes32 public constant ORDER_OF_ROLE = keccak256("ORDER_OF_ROLE");
    bytes32 public constant BUYER_OF_ROLE = keccak256("BUYER_OF_ROLE");
    bytes32 public constant SHIPPER_OF_ROLE = keccak256("SHIPPER_OF_ROLE");
    bytes32 public constant RECIEVER_OF_ROLE = keccak256("RECIEVER_OF_ROLE");

    modifier onlyHarvester() {
        require(has(HARVEST_ROLE, msg.sender, ""), "Missing Harvester Role");
        _;
    }

    modifier onlyBuyer() {
        require(has(BUYER_ROLE, msg.sender, ""), "Missing Buyer Role");
        _;
    }

    modifier onlyShipper() {
        require(has(SHIPPER_ROLE, msg.sender, ""), "Missing Shipper Role");
        _;
    }

    modifier onlyBeekeeper() {
        require(has(BEEKEEPER_ROLE, msg.sender, ""), "Missing Beekeeper Role");
        _;
    }

    constructor() public {
        addRole(HARVEST_ROLE);
        addRole(BUYER_ROLE);
        addRole(SHIPPER_ROLE);
        addRole(BEEKEEPER_ROLE);

        addRole(HARVESTER_OF_ROLE);
        addRole(ORDER_OF_ROLE);
        addRole(BUYER_OF_ROLE);
        addRole(SHIPPER_OF_ROLE);
        addRole(RECIEVER_OF_ROLE);
    }

    function roleHash(bytes32 _role) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("ROLE", _role));
    }

    function permissionHash(address _who, bytes32 _role, bytes32 _for) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("PERMISSION", _who, _role, _for));
    }

    function addRole(bytes32 _role) internal {
        bytes32 thisRoleHash = roleHash(_role);
        require(roles[thisRoleHash] == false, "Role Already Exists");
        roles[thisRoleHash] = true;
    }

    function addPermission(bytes32 _role, address _who, bytes32 _for) internal {
        bytes32 thisRoleHash = roleHash(_role);
        require(roles[thisRoleHash] == true, "Role Does Not Exists");
        bytes32 thisPermissionHash = permissionHash(_who, _role, _for);
        require(permissions[thisPermissionHash] == false, "Permission Already Exists");
        permissions[thisPermissionHash] = true;
    }

    modifier hasPermission(bytes32 _role, address _who, bytes32 _for, string _message){
        require(has(_role, _who, _for), _message);
        _;
    }

    /**
    * @dev check if an account has this role
    * @return bool
    */
    function has(bytes32 _role, address _who, bytes32 _for)
      internal
      view
      returns (bool)
    {
        require(_who != address(0), "Cannot check address of contract owner");
        bytes32 thisPermissionHash = permissionHash(_who, _role, _for);
        return permissions[thisPermissionHash];
    }

}