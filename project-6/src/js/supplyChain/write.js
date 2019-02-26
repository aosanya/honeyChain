var SupplyChainWrite = {

    createNewContract: async function(callback) {
        App.contracts.SupplyChain.new().then(function(instance) {
            console.log(instance)
            console.log(instance.contract.address)
            console.log(callback)
            callback(instance)
            //console.log(instance)
            //console.log(instance.contract.address)
            //return instance.contract.address;
        }).catch(function(err) {
            console.log(err.message);
            return null;
        });

    },

    addHarvester: async function(event) {
        event.preventDefault();

        console.log(App.harvesterAddress)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        try{
            const HARVEST_ROLE = await instance.HARVEST_ROLE();
            const harvestItem = await instance.addPermission(HARVEST_ROLE, App.harvesterAddress, "");
            return {successful: true, tx : harvestItem, message : "Harvester Added Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    harvestItem: async function(event) {
        event.preventDefault();
        console.log(App.harvest)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        var event = instance.Harvested({})

        //ToDo Centralize the events logging
        await event.watch((err, res) => {
            Display.addTransactionResults("Posted harvest upc",res.args.upc, true)
        })

        try{
            const harvestItem = await instance.harvestItem(
                                                        App.upc,
                                                        App.metamaskAccountID,
                                                        App.harvest.originBeekeeperName,
                                                        App.harvest.originFarmInformation,
                                                        App.harvest.originFarmLatitude,
                                                        App.harvest.originFarmLongitude,
                                                        App.harvest.harvestQuantity,
                                                        App.harvest.productNotes
                                                    );
            return {successful: true, tx : harvestItem, message : "Harvest Posted Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    placeOrder: async function (event) {
        event.preventDefault();
        console.log(App.order)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        var event = instance.PlacedOrder({})

        //ToDo Centralize the events logging
        await event.watch((err, res) => {
            Display.addTransactionResults("", "Posted order.", true)
            Display.addTransactionResults("Order id : ",res.args.orderId, true)
            Display.addTransactionResults("Quantity : ",res.args.quantity, true)
        })

        try{
            console.log(instance)
            const orderItem = await instance.placeOrder(
                App.upc,
                App.order.quantity
            );
            return {successful: true, tx : orderItem, message : "Order Posted Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    sendQuote: async function (event) {
        event.preventDefault();

        console.log(App.quote)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        var event = instance.SentQuote({})

        await event.watch((err, res) => {
            Display.addTransactionResults("", "Posted quote.", true)
            Display.addTransactionResults("Quote id : ",res.args.quoteId, true)
        })

        try{
            console.log(instance)
            const quote = await instance.sendQuote(
                App.quote.orderId,
                App.quote.price,
                App.quote.shipperId,
                App.quote.shippingCost,
                App.quote.downpayment
            );
            return {successful: true, tx : quote, message : "Quote Posted Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    purchase: async function (event) {
        event.preventDefault();
        const instance = await App.contracts.SupplyChain.at(App.contract)

        var event = instance.Purchased({})

        await event.watch((err, res) => {
            Display.addTransactionResults("", "Posted purchase.", true)
            Display.addTransactionResults("Purchase id : ",res.args.purchaseId, true)
        })

        try{
            const downPayment = await instance.fetchDownpayment(App.purchase.quoteId);
            console.log(downPayment)
            const quote = await instance.purchase(
                App.purchase.quoteId, {value : downPayment}
            );
            return {successful: true, tx : quote, message : "Purchase Posted Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    ship: async function (event) {
        event.preventDefault();
        console.log(App.ship)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        var event = instance.Shipped({})

        await event.watch((err, res) => {
            Display.addTransactionResults("", "Posted shipment.", true)
            Display.addTransactionResults("Shipment id : ",res.args.shipmentId, true)
        })

        try{
            const shipment = await instance.ship(
                App.ship.purchaseId
            );
            return {successful: true, tx : shipment, message : "Shipped Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    deliver: async function (event) {
        event.preventDefault();
        console.log(App.deliver)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        var event = instance.Delivered({})

        await event.watch((err, res) => {
            Display.addTransactionResults("", "Posted delivery.", true)
            Display.addTransactionResults("Shipment id : ",res.args.shipmentId, true)
        })

        try{
            const delivery = await instance.deliver(
                App.deliver.shippingId
            );
            return {successful: true, tx : delivery, message : "Delivery Successfully"}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },
}