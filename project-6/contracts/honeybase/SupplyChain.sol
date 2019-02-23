pragma solidity ^0.4.24;

import "../honeyaccesscontrol/AccessControl.sol";
// Define a contract 'Supplychain'
contract SupplyChain is AccessControl {

    // Define 'owner'
    address owner;

    //bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant HARVEST_ROLE = keccak256("HARVEST_ROLE");
    bytes32 public constant HARVESTER_OF_ROLE = keccak256("HARVEST_OF_ROLE");
    bytes32 public constant ORDER_OF_ROLE = keccak256("ORDER_OF_ROLE");
    bytes32 public constant BUYER_OF_ROLE = keccak256("BUYER_OF_ROLE");
    bytes32 public constant SHIPPER_OF_ROLE = keccak256("SHIPPER_OF_ROLE");
    bytes32 public constant RECIEVER_OF_ROLE = keccak256("RECIEVER_OF_ROLE");

    //bytes32 public constant SHIPPER_ROLE = keccak256("SHIPPER_ROLE");

    // Define a variable called 'upc' for Universal Product Code (UPC)
    // uint  upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint  sku;

    uint  orderId;

    uint quoteId;

    uint purchaseId;

    uint shipmentId;

    // Define a public mapping 'harvests' that maps the UPC to a Harvest.
    mapping (uint => Harvest) harvests;
    mapping (uint => bool) harvestUPCs;

    // Define a public mapping 'orders' that maps the UPC to an Order.
    mapping (uint => Order) orders;
    mapping (uint => bool) orderIds;

    // Define a public mapping 'quotes' that maps the orderId to a quote.
    mapping (uint => Quote) quotes;
    mapping (uint => bool) quoteIds;

    // Define a public mapping 'purchases' that maps the purchaseId to a purchase.
    mapping (uint => Purchase) purchases;
    mapping (uint => bool) purchaseIds;

     // Define a public mapping 'shipment' that maps the shipmentId to a shipment.
    mapping (uint => Shipment) shipments;
    mapping (uint => bool) shipmentIds;

    // Define a public mapping 'harvestsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) harvestsHistory;

    string private constant ERROR_HARVEST_DOES_NOT_EXIST = "ERROR_HARVEST_DOES_NOT_EXIST";
    string private constant ERROR_HARVEST_ALREADY_EXISTS = "ERROR_HARVEST_ALREADY_EXISTS";
    string private constant ERROR_ORDER_DOES_NOT_EXIST = "ERROR_ORDER_DOES_NOT_EXIST";
    string private constant ERROR_QUOTE_DOES_NOT_EXIST = "ERROR_QUOTE_DOES_NOT_EXIST";
    string private constant ERROR_PURCHASE_DOES_NOT_EXIST = "ERROR_PURCHASE_DOES_NOT_EXIST";
    string private constant ERROR_SHIPMENT_DOES_NOT_EXIST = "ERROR_SHIPMENT_DOES_NOT_EXIST";
    string private constant ERROR_ALREADY_DELIVERED = "ERROR_ALREADY_DELIVERED";
    string private constant ERROR_SHIPPINGDOWNPAYMENT = "ERROR_SHIPPINGDOWNPAYMENT_MORE_THAN_SHIPPINGCOST";

    // Define enum 'State' with the following values:
    enum State
    {
        Harvested,              // 0
        PlacedOrder,            // 1
        SentQuote,              // 2
        Purchased,     // 3
        Shipped,          // 4
        Delivered,         // 5
        ReleasedPayment         // 6
    }

    // Define a struct 'Item' with the following fields:
    struct Harvest {
        uint    sku;  // Stock Keeping Unit (SKU)
        uint    upc; // Universal Product Code (UPC), generated by the Harvester, goes on the package, can be verified by the Buyer
        address harvesterId;  // Metamask-Ethereum address of the Harvester
        address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
        address originBeekeeperID; // Metamask-Ethereum address of the BeeKeeper
        string  originBeekeeperName; // BeeKeeper Name
        string  originFarmInformation;  // BeeKeeper Information
        string  originFarmLatitude; // Farm Latitude
        string  originFarmLongitude;  // Farm Longitude
        uint    quantity; // Quantity in milliliters
        uint    productID;  // Product ID potentially a combination of upc + sku
        string  productNotes; // Product Notes
        uint    productPrice; // Product Price
        address shipperID; // Metamask-Ethereum address of the Shipper
        address buyerID; // Metamask-Ethereum address of the Buyer
    }

    struct Order {
        uint    orderId;
        address buyerId;
        uint    upc;
        uint    quantity;
    }

    struct Quote {
        uint    quoteId;
        uint    orderId;
        uint    upc;
        uint    price;
        address shipperId;
        uint    shippingCost;
        uint    shippingDownPayment;
        uint    date;
    }

    struct Purchase {
        uint    purchaseId;
        uint    quoteId;
        uint    orderId;
        uint    upc;
        uint    date;
        uint    shipmentId;
    }

    struct Shipment {
        uint    shipmentId;
        address shipper;
        uint    purchaseId;
        uint    quoteId;
        uint    orderId;
        uint    upc;
        uint    date;
        bool    delivered;
        uint    dateDelivered;
    }

    // Define 8 events with the same 8 state values and accept 'upc' as input argument
    event Harvested(uint upc);
    event PlacedOrder(uint orderId,uint quantity);
    event SentQuote(uint quoteId);
    event Purchased(uint purchaseId);
    event Shipped(uint shipmentId);
    event Delivered(uint shipmentId);

    // Define a modifer that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }


    modifier harvestExists(uint _upc) {
        require(harvestUPCs[_upc] == true, ERROR_HARVEST_DOES_NOT_EXIST);
        _;
    }

    modifier orderExists(uint _orderId) {
        require(orderIds[_orderId] == true, ERROR_ORDER_DOES_NOT_EXIST);
        _;
    }

    modifier quoteExists(uint _quoteId) {
        require(quoteIds[_quoteId] == true, ERROR_QUOTE_DOES_NOT_EXIST);
        _;
    }

    modifier purchaseExists(uint _purchaseId) {
        require(purchaseIds[_purchaseId] == true, ERROR_PURCHASE_DOES_NOT_EXIST);
        _;
    }

    modifier shipmentExists(uint _shippingId) {
        require(shipmentIds[_shippingId] == true, ERROR_SHIPMENT_DOES_NOT_EXIST);
        _;
    }
    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = harvests[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        harvests[_upc].buyerID.transfer(amountToReturn);
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        sku = 1;
        orderId = 1;
        quoteId = 1;
        purchaseId = 1;
        shipmentId = 1;
        addRole(HARVEST_ROLE);
        addRole(HARVESTER_OF_ROLE);
        addRole(ORDER_OF_ROLE);
        addRole(BUYER_OF_ROLE);
        addRole(SHIPPER_OF_ROLE);
        addRole(RECIEVER_OF_ROLE);
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
          selfdestruct(owner);
        }
    }

    // Define a function 'harvestItem' that allows a farmer to mark an harvest 'Harvested'
    function harvestItem(uint _upc, address _originBeekeeperID, string _originBeekeeperName, string _originFarmInformation, string  _originFarmLatitude, string  _originFarmLongitude, uint _quantity, string  _productNotes) public
    hasPermission(HARVEST_ROLE, msg.sender, "", "Missing Harvester Role")
    {
        require(harvestUPCs[_upc] == false, ERROR_HARVEST_ALREADY_EXISTS);
        // Add the new harvest as part of Harvest
        Harvest storage harvest_ = harvests[_upc];
        harvest_.sku = sku;
        harvest_.upc = _upc;
        harvest_.ownerID = owner;
        harvest_.originBeekeeperID = _originBeekeeperID;
        harvest_.originBeekeeperName = _originBeekeeperName;
        harvest_.originFarmInformation = _originFarmInformation;
        harvest_.originFarmLatitude = _originFarmLatitude;
        harvest_.originFarmLongitude = _originFarmLongitude;
        harvest_.quantity = _quantity;
        harvest_.productNotes = _productNotes;
        harvest_.harvesterId = msg.sender;
        harvestUPCs[_upc] = true;
        addPermission(HARVESTER_OF_ROLE, msg.sender, bytes32(_upc));
        emit Harvested(_upc);
        sku = sku + 1;
    }

    function placeOrder(uint _upc, uint quantity) public
    harvestExists(_upc)
    // Anybody can Place an Order

    {
        Harvest storage harvest_ = harvests[_upc];
        Order storage order_ = orders[orderId];
        order_.orderId = orderId;
        order_.buyerId = msg.sender;
        order_.upc = _upc;
        order_.quantity = quantity;
        orderIds[orderId] = true;
        addPermission(ORDER_OF_ROLE, msg.sender, bytes32(orderId));

        emit PlacedOrder(orderId, quantity);

        orderId = orderId + 1;
    }

    // Define a function 'packItem' that allows a farmer to mark an harvest 'Packed'
    function sendQuote(uint _orderId, uint _price, address _shipperId, uint _shippingCost,uint _shippingDownPayment) public
    orderExists(_orderId)
    hasPermission(HARVESTER_OF_ROLE, msg.sender, bytes32(_orderId) ,"Missing HARVESTER_OF_ROLE")
    {
        require(_shippingDownPayment <= _shippingCost, ERROR_SHIPPINGDOWNPAYMENT);
        Order storage order_ = orders[_orderId];
        Quote storage quote_ = quotes[quoteId];
        quote_.quoteId = quoteId;
        quote_.orderId = _orderId;
        quote_.upc = order_.upc;
        quote_.price = _price;
        quote_.shipperId = _shipperId;
        quote_.shippingCost = _shippingCost;
        quote_.shippingDownPayment = _shippingDownPayment;
        quote_.date = now;
        quoteIds[quoteId] = true;

        addPermission(BUYER_OF_ROLE, order_.buyerId, bytes32(quote_.quoteId));

        emit SentQuote(quoteId);
        quoteId = quoteId + 1;
    }

    // Define a function 'sellItem' that allows a farmer to mark an harvest 'ForSale'
    function purchase(uint _quoteId) public
    quoteExists(_quoteId)
    hasPermission(BUYER_OF_ROLE, msg.sender, bytes32(_quoteId) ,"Missing BUYER_OF_ROLE") payable
    {
        Quote storage quote_ = quotes[_quoteId];
        Purchase storage purchase_ = purchases[purchaseId];
        purchase_.quoteId = _quoteId;
        purchase_.purchaseId = purchaseId;
        purchase_.orderId = quote_.orderId;
        purchase_.upc = quote_.upc;
        purchase_.date = now;
        purchaseIds[purchaseId] = true;

        quote_.shipperId.transfer(quote_.shippingDownPayment);
        if(msg.value > quote_.shippingDownPayment) {
            msg.sender.transfer(msg.value - quote_.shippingDownPayment);
        }

        addPermission(SHIPPER_OF_ROLE, quote_.shipperId, bytes32(purchase_.purchaseId));

        emit Purchased(purchaseId);
        purchaseId = purchaseId + 1;
    }

    // Define a function 'ship' that allows the harvester to mark an harvest 'Shipped'
    // Use the above modifers to check if the harvest is sold
    function ship(uint _purchaseId) public
      purchaseExists(_purchaseId)
      hasPermission(SHIPPER_OF_ROLE, msg.sender, bytes32(_purchaseId) ,"Missing SHIPPER_OF_ROLE")
    {
        Purchase storage purchase_ = purchases[_purchaseId];
        Shipment storage shipment_ = shipments[shipmentId];
        shipment_.shipmentId = shipmentId;
        shipment_.purchaseId = _purchaseId;
        shipment_.quoteId = purchase_.quoteId;
        shipment_.orderId = purchase_.orderId;
        shipment_.upc = purchase_.upc;
        shipment_.shipper = msg.sender;
        shipment_.purchaseId = _purchaseId;
        shipment_.date = now;
        shipmentIds[shipmentId] = true;

        Order storage order_ = orders[shipment_.orderId];
        addPermission(RECIEVER_OF_ROLE, order_.buyerId, bytes32(shipment_.shipmentId));

        emit Shipped(shipmentId);
        shipmentId = shipmentId + 1;

    }

    // Define a function 'receiveItem' that allows the shipper to mark an harvest 'Received'
    // Use the above modifiers to check if the harvest is shipped
    function deliver(uint _shipmentId) public
        shipmentExists(_shipmentId)
        hasPermission(RECIEVER_OF_ROLE, msg.sender, bytes32(_shipmentId) ,"Missing RECIEVER_OF_ROLE") payable
    {

        Shipment storage shipment_ = shipments[_shipmentId];
        require(shipment_.delivered == false, ERROR_ALREADY_DELIVERED);
        Purchase storage purchase_ = purchases[shipment_.purchaseId];

        shipment_.delivered = true;
        shipment_.dateDelivered = now;

        Harvest storage harvest_ = harvests[shipment_.upc];
        Quote storage quote_ = quotes[shipment_.quoteId];

        //Pay shipping balance

        if(quote_.shippingDownPayment > quote_.shippingCost) {
            quote_.shipperId.transfer(quote_.shippingCost - quote_.shippingDownPayment);
        }

        harvest_.harvesterId.transfer(quote_.price);


        uint256 balanceCost = quote_.price + quote_.shippingCost - quote_.shippingDownPayment;
        if(msg.value > balanceCost) {
           msg.sender.transfer(msg.value - balanceCost);
        }

        emit Delivered(_shipmentId);
    }


    // Define a function 'fetchHarvest' that fetches the data
    function fetchHarvest(uint _upc) public view returns
    (
    uint    harvestSKU,
    uint    harvestUPC,
    address harvesterId,
    address ownerID,
    address originBeekeeperID,
    string  originBeekeeperName,
    string  originFarmInformation,
    string  originFarmLatitude,
    string  originFarmLongitude,
    uint    quantity
    )
    {
      // Assign values to the 8 parameters

        Harvest storage harvest_ = harvests[_upc];
        harvestSKU = harvest_.sku;
        harvestUPC = harvest_.upc;
        harvesterId = harvest_.harvesterId;
        ownerID = harvest_.ownerID;
        originBeekeeperID = harvest_.originBeekeeperID;
        originBeekeeperName = harvest_.originBeekeeperName;
        originFarmInformation = harvest_.originFarmInformation;
        originFarmLatitude = harvest_.originFarmLatitude;
        originFarmLongitude = harvest_.originFarmLongitude;
        quantity = harvest_.quantity;
    }

    // Define a function 'fetchItemBufferTwo' that fetches the data
    function fetchItemBufferTwo(uint _upc) public view returns
    (
    uint    harvestSKU,
    uint    harvestUPC,
    uint    productID,
    string  productNotes,
    uint    productPrice,
    uint    harvestState,
    address harvesterID,
    address shipperID,
    address buyerID
    )
    {
      // Assign values to the 9 parameters
        return
        (
        harvestSKU,
        harvestUPC,
        productID,
        productNotes,
        productPrice,
        harvestState,
        harvesterID,
        shipperID,
        buyerID
        );
    }

    // Define a function 'fetchHarvest' that fetches the data
    function fetchOrder(uint _orderId) public view returns
    (
    uint    orderId,
    address buyerId,
    uint    harvestUPC,
    uint    quantity
    )
    {
        Order storage order_ = orders[_orderId];
        orderId = order_.orderId;
        buyerId = order_.buyerId;
        harvestUPC = order_.upc;
        quantity = order_.quantity;
    }

    // Define a function 'fetchHarvest' that fetches the data
    function fetchQuote(uint _quoteId) public view returns
    (
    uint    quoteId,
    uint    orderId,
    uint    price,
    address shipperId,
    uint    shippingCost,
    uint    shippingDownPayment,
    uint    date
    )
    {
        Quote storage quote_ = quotes[_quoteId];
        quoteId = quote_.quoteId;
        orderId = quote_.orderId;
        price = quote_.price;
        shipperId = quote_.shipperId;
        shippingCost = quote_.shippingCost;
        shippingDownPayment = quote_.shippingDownPayment;
        date = quote_.date;
    }

    function fetchPurchase(uint _purchaseId) public view returns
    (
    uint    purchaseId,
    uint    quoteId,
    uint    date
    )
    {
        Purchase storage purchase_ = purchases[_purchaseId];
        purchaseId = purchase_.purchaseId;
        quoteId = purchase_.quoteId;
        date = purchase_.date;
    }

    function fetchShipment(uint _shipmentId) public view returns
    (
    uint    shipmentId,
    address shipper,
    uint    purchaseId,
    uint    date,
    bool    delivered,
    uint    dateDelivered
    )
    {
        Shipment storage shipment_ = shipments[_shipmentId];
        shipmentId = shipment_.shipmentId;
        shipper = shipment_.shipper;
        purchaseId = shipment_.purchaseId;
        date = shipment_.date;
        delivered = shipment_.delivered;
        dateDelivered = shipment_.dateDelivered;
    }
}
