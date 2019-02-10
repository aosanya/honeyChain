pragma solidity ^0.4.24;
// Define a contract 'Supplychain'
contract SupplyChain {

    // Define 'owner'
    address owner;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint  upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint  sku;

    uint  orderId;

    uint quoteId;

    uint purchaseId;

    uint shipmentId;

    // Define a public mapping 'harvests' that maps the UPC to a Harvest.
    mapping (uint => Harvest) harvests;

    // Define a public mapping 'orders' that maps the UPC to an Order.
    mapping (uint => Order) orders;

    // Define a public mapping 'quotes' that maps the orderId to a quote.
    mapping (uint => Quote) quotes;

    // Define a public mapping 'purchases' that maps the purchaseId to a purchase.
    mapping (uint => Purchase) purchases;

     // Define a public mapping 'shipment' that maps the shipmentId to a shipment.
    mapping (uint => Shipment) shipments;

    // Define a public mapping 'harvestsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) harvestsHistory;

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

    State constant defaultState = State.Harvested;

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
        State   harvestState;  // Product State as represented in the enum above
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
        uint    price;
        uint    shippingCost;
        uint    downPayment;
        uint    date;
    }

    struct Purchase {
        uint    purchaseId;
        uint    quoteId;
        uint    date;
        uint    shipmentId;
    }

    struct Shipment {
        uint    shipmentId;
        address shipper;
        uint    purchaseId;
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

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = harvests[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        harvests[_upc].buyerID.transfer(amountToReturn);
    }

    // Define a modifier that checks if an harvest.state of a upc is Harvested
    modifier harvested(uint _upc) {
        require(harvests[_upc].harvestState == State.Harvested);
        _;
    }

    // Define a modifier that checks if an harvest.state of a upc is PlacedOrder
    modifier placedOrder(uint _upc) {
        require(harvests[_upc].harvestState == State.PlacedOrder);
        _;
    }

    // Define a modifier that checks if an harvest.state of a upc is SentQuote
    modifier sentQuote(uint _upc) {
        require(harvests[_upc].harvestState == State.SentQuote);
        _;
    }

    // Define a modifier that checks if an harvest.state of a upc is Purchased
    modifier commitedToPurchase(uint _upc) {
        require(harvests[_upc].harvestState == State.Purchased);
        _;
    }

    // Define a modifier that checks if an harvest.state of a upc is Shipped
    modifier pickedUpHoney(uint _upc) {
        require(harvests[_upc].harvestState == State.Shipped);
        _;
    }

    // Define a modifier that checks if an harvest.state of a upc is Delivered
    modifier deliveredHoney(uint _upc) {
        require(harvests[_upc].harvestState == State.Delivered);
        _;
    }

    // Define a modifier that checks if an harvest.state of a upc is ReleasedPayment
    modifier releasedPayment(uint _upc) {
        require(harvests[_upc].harvestState == State.ReleasedPayment);
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        sku = 1;
        upc = 1;
        orderId = 1;
        quoteId = 1;
        purchaseId = 1;
        shipmentId = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
          selfdestruct(owner);
        }
    }

    // Define a function 'harvestItem' that allows a farmer to mark an harvest 'Harvested'
    function harvestItem(uint _upc, address _originBeekeeperID, string _originBeekeeperName, string _originFarmInformation, string  _originFarmLatitude, string  _originFarmLongitude, uint _quantity, string  _productNotes) public
    {
        // Add the new harvest as part of Harvest
        Harvest storage harvest_ = harvests[_upc];
        harvest_.sku = sku;
        harvest_.upc = upc;
        harvest_.ownerID = owner;
        harvest_.originBeekeeperID = _originBeekeeperID;
        harvest_.originBeekeeperName = _originBeekeeperName;
        harvest_.originFarmInformation = _originFarmInformation;
        harvest_.originFarmLatitude = _originFarmLatitude;
        harvest_.originFarmLongitude = _originFarmLongitude;
        harvest_.quantity = _quantity;
        harvest_.productNotes = _productNotes;
        harvest_.harvestState = defaultState;
        harvest_.harvesterId = msg.sender;


        emit Harvested(upc);
        sku = sku + 1;
    }

    // Define a function 'processtItem' that allows a farmer to mark an harvest 'Processed'
    function placeOrder(address buyerId, uint _upc, uint quantity) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Call modifier to verify caller of this function

    {
        Order storage order_ = orders[orderId];
        order_.orderId = orderId;
        order_.buyerId = buyerId;
        order_.upc = upc;
        order_.quantity = quantity;


        emit PlacedOrder(orderId, quantity);

        orderId = orderId + 1;
    }

    // Define a function 'packItem' that allows a farmer to mark an harvest 'Packed'
    function sendQuote(uint _orderId, uint _price, uint _shippingCost,uint _downPayment) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Call modifier to verify caller of this function

    {
        Quote storage quote_ = quotes[quoteId];
        quote_.quoteId = quoteId;
        quote_.orderId = _orderId;
        quote_.price = _price;
        quote_.shippingCost = _shippingCost;
        quote_.downPayment = _downPayment;
        quote_.date = now;


        emit SentQuote(quoteId);
        quoteId = quoteId + 1;
    }

    // Define a function 'sellItem' that allows a farmer to mark an harvest 'ForSale'
    function purchase(uint _quoteId) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Call modifier to verify caller of this function

    {

        Purchase storage purchase_ = purchases[purchaseId];
        purchase_.quoteId = _quoteId;
        purchase_.purchaseId = purchaseId;
        purchase_.date = now;

        emit Purchased(purchaseId);
        purchaseId = purchaseId + 1;
    }

    // Define a function 'ship' that allows the harvester to mark an harvest 'Shipped'
    // Use the above modifers to check if the harvest is sold
    function ship(uint _purchaseId) public
      // Call modifier to check if upc has passed previous supply chain stage

      // Call modifier to verify caller of this function

    {
        Shipment storage shipment_ = shipments[shipmentId];
        shipment_.shipmentId = shipmentId;
        shipment_.shipper = msg.sender;
        shipment_.purchaseId = _purchaseId;
        shipment_.date = now;

        emit Shipped(shipmentId);
        shipmentId = shipmentId + 1;

    }

    // Define a function 'receiveItem' that allows the shipper to mark an harvest 'Received'
    // Use the above modifiers to check if the harvest is shipped
    function deliver(uint _shipmentId) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Access Control List enforced by calling Smart Contract / DApp
    {
        Shipment storage shipment_ = shipments[_shipmentId];
        shipment_.delivered = true;
        shipment_.dateDelivered = now;

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
    uint    shippingCost,
    uint    downPayment,
    uint    date
    )
    {
        Quote storage quote_ = quotes[_quoteId];
        quoteId = quote_.quoteId;
        orderId = quote_.orderId;
        price = quote_.price;
        shippingCost = quote_.shippingCost;
        downPayment = quote_.downPayment;
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
