var SupplyChainWrite = {

    harvestItem: async function(event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.at(App.contract)

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

        return harvestItem;
    },

    placeOrder: async function (event) {
        event.preventDefault();

        console.log(App.order)

        const instance = await App.contracts.SupplyChain.at(App.contract)

        const orderItem = await instance.placeOrder(
            App.upc,
            App.order.quantity,
            1
        );

        return orderItem;
    },

}