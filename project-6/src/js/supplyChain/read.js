var SupplyChainRead = {
    fetchHarvest: async function () {
        ///   event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));
        console.log('upc',App.upc);
        const instance = await App.contracts.SupplyChain.at(App.contract)
        const harvest = await instance.fetchHarvest(App.upc)
        return harvest
    },

    fetchOrder: async function () {
        console.log('Order Id',App.quote.orderId);
        const instance = await App.contracts.SupplyChain.at(App.contract)
        const order = await instance.fetchOrder(App.quote.orderId)
        return order
    },

    fetchQuote: async function () {
        console.log('Quote Id',App.purchase.quoteId);
        const instance = await App.contracts.SupplyChain.at(App.contract)
        const quote = await instance.fetchQuote(App.purchase.quoteId)
        return quote
    },

    fetchPurchase: async function () {
        console.log('Purchase Id', App.ship.purchaseId);
        const instance = await App.contracts.SupplyChain.at(App.contract)
        const purchase = await instance.fetchPurchase(App.ship.purchaseId)
        return purchase
    },

    fetchShipment: async function () {
        console.log('Shipping Id', App.deliver.shippingId);
        const instance = await App.contracts.SupplyChain.at(App.contract)
        const shipment = await instance.fetchShipment(App.deliver.shippingId)
        return shipment
    },

}