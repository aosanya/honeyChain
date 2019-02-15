var SupplyChainRead = {
    fetchHarvest: async function () {
        ///   event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);
        const instance = await App.contracts.SupplyChain.at(App.contract)
        const harvest = await instance.fetchHarvest(App.upc)
        return harvest
    }
}