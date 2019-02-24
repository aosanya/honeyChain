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

    harvestItem: async function(event) {
        event.preventDefault();

        console.log(App.harvest)
        const instance = await App.contracts.SupplyChain.at(App.contract)
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
            return {successful: true, tx : harvestItem, message : ""}
        }
        catch(error){
            return {successful: false, tx : null, message : error.toString()}
        }
    },

    placeOrder: async function (event) {
        event.preventDefault();
        console.log(App.order)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        console.log(instance)
        const orderItem = await instance.placeOrder(
            App.upc,
            App.order.quantity
        );

        return orderItem;
    },

    sendQuote: async function (event) {
        event.preventDefault();
        console.log(App.quote)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        console.log(instance)
        const quote = await instance.sendQuote(
            App.quote.orderId,
            App.quote.price,
            App.quote.shippingCost,
            App.quote.downpayment
        );

        return quote;
    },

    purchase: async function (event) {
        event.preventDefault();
        console.log(App.purchase)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        console.log(instance)
        const quote = await instance.purchase(
            App.purchase.quoteId
        );

        return quote;
    },

    ship: async function (event) {
        event.preventDefault();
        console.log(App.ship)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        console.log(instance)
        const shipment = await instance.ship(
            App.ship.purchaseId
        );

        return shipment;
    },

    deliver: async function (event) {
        event.preventDefault();
        console.log(App.deliver)
        const instance = await App.contracts.SupplyChain.at(App.contract)

        console.log(instance)
        const delivery = await instance.deliver(
            App.deliver.shippingId
        );

        return delivery;
    },
}