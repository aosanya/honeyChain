// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli






    const ownerID = accounts[0]
    const originBeeKeeperID1 = accounts[1]
    const harvesterId_1 = accounts[2]
    const buyerId_1 = accounts[3]
    const shipperId_1 = accounts[4]

    const originBeeKeeperID2 = accounts[5]


    //harvest 1
    var sku1 = 1
    var upc1 = 1
    const originBeeKeeperName1 = "Foo Bee"
    const originBeeKeeperInformation1 = "Alego Nyajuok"
    const originBeeKeeperLatitude1 = "-38.239770"
    const originBeeKeeperLongitude1 = "144.341490"
    //

    //harvest 2
    var sku2 = 2
    var upc2 = 2
    const originBeeKeeperName2 = "Foo Bee2"
    const originBeeKeeperInformation2 = "Alego Nyajuok2"
    const originBeeKeeperLatitude2 = "2"
    const originBeeKeeperLongitude2 = "-2"
    //


    const quantity = 10000
    //
    const orderId_1 = 1
    const orderQuantity_1 = quantity / 2
    const price_1 = 10
    const shippingCost_1 = 4
    const shippingDownPayment_1 = 2
    const purchaseId_1 = 1
    const shipmentId_1 = 1
    const quoteId_1 = 1
    //

    var productID = sku1 + upc1
    const productNotes = "Sweetest honey from natural nectar"
    const productPrice = web3.toWei(1, "ether")
    var itemState = 0

    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("BeeKeeper: accounts[1] ", accounts[1])
    console.log("Harvester: accounts[2] ", accounts[2])
    console.log("Buyer: accounts[3] ", accounts[3])
    console.log("Shipper: accounts[4] ", accounts[4])

    var supplyChain
    before(async () => {
        // supplyChain = await SupplyChain.new()

        // //const OWNER_ROLE = await SupplyChain.OWNER_ROLE();
        // const HARVEST_ROLE = await supplyChain.HARVEST_ROLE();

        // await supplyChain.addPermission(HARVEST_ROLE, harvesterId_1, "")
    })

    beforeEach(async () => {
        supplyChain = await SupplyChain.new()

        //const OWNER_ROLE = await SupplyChain.OWNER_ROLE();
        const HARVEST_ROLE = await supplyChain.HARVEST_ROLE();

        await supplyChain.addPermission(HARVEST_ROLE, harvesterId_1, "")
    })


    context('harvest Honey', () => {

        it("Testing smart contract function harvestItem() that allows a harvester to harvest honey", async() => {
            // Declare and Initialize a variable for event
            var eventEmitted = false

            // Watch the emitted event Harvested()
            var event = supplyChain.Harvested({fromBlock: 0})

            await event.watch((err, res) => {
                eventEmitted = true
            })

            // Mark an item as Harvested by calling function harvestItem()
            await supplyChain.harvestItem(upc1, originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultHarvest = await supplyChain.fetchHarvest.call(upc1)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc1)
            // Verify the result set
            assert.equal(resultHarvest[0], sku1, 'Error: Invalid item SKU')
            assert.equal(resultHarvest[1], upc1, 'Error: Invalid item UPC')
            assert.equal(resultHarvest[2], harvesterId_1, 'Error: Invalid harvesterId')
            assert.equal(resultHarvest[3], ownerID, 'Error: Missing or Invalid ownerID')
            assert.equal(resultHarvest[4], originBeeKeeperID1, 'Error: Missing or Invalid originBeekeeperID')
            assert.equal(resultHarvest[5], originBeeKeeperName1, 'Error: Missing or Invalid originBeekeeperName')
            assert.equal(resultHarvest[6], originBeeKeeperInformation1, 'Error: Missing or Invalid originFarmInformation')
            assert.equal(resultHarvest[7], originBeeKeeperLatitude1, 'Error: Missing or Invalid originFarmLatitude')
            assert.equal(resultHarvest[8], originBeeKeeperLongitude1, 'Error: Missing or Invalid originFarmLongitude')
            assert.equal(resultHarvest[9], quantity, 'Error: Missing or Quantity')
            assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
            //assert.equal(eventEmitted, true, 'Invalid event emitted')
        })

        it("Testing smart contract function harvestItem() that allows a harvester to harvest honey with upc2", async() => {
            // Declare and Initialize a variable for event
            var eventEmitted = false

            // Watch the emitted event Harvested()
            var event = supplyChain.Harvested({fromBlock: 0})

            await event.watch((err, res) => {
                eventEmitted = true
            })

            // Mark an item as Harvested by calling function harvestItem()
            await supplyChain.harvestItem(upc2, originBeeKeeperID2, originBeeKeeperName2, originBeeKeeperInformation2, originBeeKeeperLatitude2, originBeeKeeperLongitude2, quantity, productNotes, {from: harvesterId_1})

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultHarvest = await supplyChain.fetchHarvest.call(upc2)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc2)
            // Verify the result set
            assert.equal(resultHarvest[0], 1, 'Error: Invalid item SKU')
            assert.equal(resultHarvest[1], upc2, 'Error: Invalid item UPC')
            assert.equal(resultHarvest[2], harvesterId_1, 'Error: Invalid harvesterId')
            assert.equal(resultHarvest[3], ownerID, 'Error: Missing or Invalid ownerID')
            assert.equal(resultHarvest[4], originBeeKeeperID2, 'Error: Missing or Invalid originBeekeeperID')
            assert.equal(resultHarvest[5], originBeeKeeperName2, 'Error: Missing or Invalid originBeekeeperName')
            assert.equal(resultHarvest[6], originBeeKeeperInformation2, 'Error: Missing or Invalid originFarmInformation')
            assert.equal(resultHarvest[7], originBeeKeeperLatitude2, 'Error: Missing or Invalid originFarmLatitude')
            assert.equal(resultHarvest[8], originBeeKeeperLongitude2, 'Error: Missing or Invalid originFarmLongitude')
            assert.equal(resultHarvest[9], quantity, 'Error: Missing or Quantity')
            assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
            //assert.equal(eventEmitted, true, 'Invalid event emitted')
        })
    })

    context('place Order', () => {
        before(async () => {

            // Watch the emitted event PlacedOrder()
            var event = supplyChain.PlacedOrder()

            await event.watch((err, res) => {
                eventEmitted = true
            })

         })

        it("Testing smart contract function placeOrder() that allows a buyer to buy honey", async() => {
            await supplyChain.harvestItem(upc1,  originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})

            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})

            const resultOrder1 = await supplyChain.fetchOrder(1)
            assert.equal(resultOrder1[0], 1, 'Error: Invalid OrderId')
            assert.equal(resultOrder1[1], buyerId_1, 'Error: Invalid BuyerId')
            assert.equal(resultOrder1[2], upc1, 'Error: Invalid UPC')
            assert.equal(resultOrder1[3], orderQuantity_1, 'Error: Invalid Quantity')

            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})

            const resultOrder2 = await supplyChain.fetchOrder(2)
            assert.equal(resultOrder2[0], 2, 'Error: Invalid OrderId')

        })
    })

    context('send quote', () => {
        before(async () => {
            // Watch the emitted event Harvested()
            var event = supplyChain.SentQuote({fromBlock: 0})

            await event.watch((err, res) => {
                eventEmitted = true
            })
        })

        it("Testing smart contract function sendQuote() that allows a harvester to sendQuote", async() => {
            await supplyChain.harvestItem(upc1,  originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})
            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})
            await supplyChain.sendQuote(orderId_1, price_1, shipperId_1, shippingCost_1, shippingDownPayment_1, {from : harvesterId_1})

            const resultOrder1 = await supplyChain.fetchQuote(1)
            assert.equal(resultOrder1[0], quoteId_1, 'Error: Invalid QuoteId')
            assert.equal(resultOrder1[1], 1, 'Error: Invalid OrderId')
            assert.equal(resultOrder1[2], price_1, 'Error: Invalid Price')
            assert.equal(resultOrder1[3], shipperId_1, 'Error: Invalid Shipper Address')
            assert.equal(resultOrder1[4], shippingCost_1, 'Error: Invalid Shipping Cost')
            assert.equal(resultOrder1[5], shippingDownPayment_1, 'Error: Invalid Shipping Downpayment')
        })
    })

    context('purchase', () => {
        before(async () => {
            // Watch the emitted event Harvested()
            var event = supplyChain.Purchased({fromBlock: 0})

            await event.watch((err, res) => {
                eventEmitted = true
            })
        })

        it("Testing smart contract function Purchased() that allows a buyer to purchase", async() => {
            await supplyChain.harvestItem(upc1,  originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})
            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})
            await supplyChain.sendQuote(orderId_1, price_1, shipperId_1, shippingCost_1, shippingDownPayment_1, {from: harvesterId_1})
            await supplyChain.purchase(quoteId_1, {from : buyerId_1, value : shippingDownPayment_1})
            const resultPurchase1 = await supplyChain.fetchPurchase(purchaseId_1)
            assert.equal(resultPurchase1[0], 1, 'Error: Invalid PurchaseId')
            assert.equal(resultPurchase1[1], 1, 'Error: Invalid QuoteId')
        })

        it("Testing smart contract function Purchased() that allows a buyer to purchase", async() => {
            await supplyChain.harvestItem(upc1,  originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})
            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})
            await supplyChain.sendQuote(orderId_1, price_1, shipperId_1, shippingCost_1, shippingDownPayment_1, {from: harvesterId_1})

            let balanceBefore = web3.eth.getBalance(buyerId_1);
            await supplyChain.purchase(quoteId_1, {from : buyerId_1, value : shippingDownPayment_1})

            let balanceAfter = web3.eth.getBalance(buyerId_1);
            let actualCost = balanceBefore - balanceAfter
            let expectedGasPrice = actualCost - shippingDownPayment_1
            let actualGasUsed = web3.eth.getBlock(web3.eth.blockNumber).gasUsed

            // console.log("Balance Before " + balanceBefore)
            // console.log("Balance After " + balanceAfter)
            // console.log("Actual Cost " + actualCost)
            // console.log("Expected Gas Price " + expectedGasPrice)
            // console.log("Actual Gas Used " + actualGasUsed)
            //let weiGasUsed = web3.toWei(actualGasUsed, "Gwei")
            assert.equal(actualGasUsed, Number((expectedGasPrice/100000000000).toFixed(0)), "Gas difference can only stem from wrong account transfers")
        })
    })

    context('ship', () => {

        before(async () => {
            // Watch the emitted event Harvested()
            var event = supplyChain.Harvested({fromBlock: 0})

            await event.watch((err, res) => {
                eventEmitted = true
            })
        })

        it("Testing smart contract function ship() that allows a shipper to ship honey", async() => {
            await supplyChain.harvestItem(upc1,  originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})
            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})
            await supplyChain.sendQuote(orderId_1, price_1, shipperId_1, shippingCost_1, shippingDownPayment_1, {from: harvesterId_1})
            await supplyChain.purchase(quoteId_1, {from : buyerId_1, value : shippingDownPayment_1})


            await supplyChain.ship(purchaseId_1, {from: shipperId_1})
            const resultShip1 = await supplyChain.fetchShipment(shipmentId_1)

            assert.equal(resultShip1[0], shipmentId_1, 'Error: Invalid ShipmentId')
            assert.equal(resultShip1[1], shipperId_1, 'Error: Invalid ShipperId')
            assert.equal(resultShip1[2], purchaseId_1, 'Error: Invalid PurchaseId')
            assert.equal(resultShip1[3] > 0, true, 'Error: Should have a shipment date')
            assert.equal(resultShip1[4], false, 'Error: Should be Undelivered')
            assert.equal(resultShip1[5] == 0, true, 'Error: Should not have a date')
        })
    })

    context('deliver', () => {

        before(async () => {

            // Watch the emitted event Harvested()
            var event = supplyChain.Harvested({fromBlock: 0})

            await event.watch((err, res) => {
                eventEmitted = true
            })
        })

        //Only the buyer can sign the shipment as delivered, upon which the payment will be released
        it("Testing smart contract function deliver() that allows a buyer to recieve honey", async() => {
            await supplyChain.harvestItem(upc1, originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})
            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})
            await supplyChain.sendQuote(orderId_1, price_1, shipperId_1, shippingCost_1, shippingDownPayment_1, {from: harvesterId_1})
            await supplyChain.purchase(quoteId_1, {from : buyerId_1, value : shippingDownPayment_1})
            await supplyChain.ship(purchaseId_1, {from: shipperId_1})

            let balance = price_1 + shippingCost_1 - shippingDownPayment_1;

            await supplyChain.deliver(shipmentId_1, {from: buyerId_1, value : balance})
            const resultShip1 = await supplyChain.fetchShipment(shipmentId_1)

            assert.equal(resultShip1[0], shipmentId_1, 'Error: Invalid ShipmentId')
            assert.equal(resultShip1[1], shipperId_1, 'Error: Invalid ShipperId')
            assert.equal(resultShip1[2], purchaseId_1, 'Error: Invalid PurchaseId')
            assert.equal(resultShip1[4], true, 'Error: Should be Delivered')
        })

        it("Cannot Deliver what is already delivered", async() => {
            await supplyChain.harvestItem(upc1, originBeeKeeperID1, originBeeKeeperName1, originBeeKeeperInformation1, originBeeKeeperLatitude1, originBeeKeeperLongitude1, quantity, productNotes, {from: harvesterId_1})
            await supplyChain.placeOrder(upc1, orderQuantity_1, {from : buyerId_1})
            await supplyChain.sendQuote(orderId_1, price_1, shipperId_1, shippingCost_1, shippingDownPayment_1, {from: harvesterId_1})
            await supplyChain.purchase(quoteId_1, {from : buyerId_1, value : shippingDownPayment_1})
            await supplyChain.ship(purchaseId_1, {from: shipperId_1})
            let balance = price_1 + shippingCost_1 - shippingDownPayment_1;

            await supplyChain.deliver(shipmentId_1, {from: buyerId_1, value : balance})
            const resultShip1 = await supplyChain.fetchShipment(shipmentId_1)

            assert.equal(resultShip1[0], shipmentId_1, 'Error: Invalid ShipmentId')
            assert.equal(resultShip1[1], shipperId_1, 'Error: Invalid ShipperId')
            assert.equal(resultShip1[2], purchaseId_1, 'Error: Invalid PurchaseId')
            assert.equal(resultShip1[4], true, 'Error: Should be Delivered')

            try{
                await supplyChain.deliver(shipmentId_1, {from: buyerId_1, value : balance})
            }
            catch (error){
                //assert.isTrue(error.toString().includes("revert ERROR_ALREADY_DELIVERED"), "Unexpected throw recieved")
                return
            }
            assert.fail('Expected throw not recieved')
        })

    })
});

