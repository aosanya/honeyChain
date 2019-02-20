App = {
    contract: "0x23e2b13b08a22e9eee431f862ec7a17ab1e99b98",
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    upc: 0,
    harvest: {
        sku: 0,
        originBeekeeperID: "0x0000000000000000000000000000000000000000",
        originBeekeeperName: null,
        originFarmInformation: null,
        originFarmLatitude: null,
        originFarmLongitude: null,
        harvestQuantity: 0,
        productNotes: null,
    },
    order :{
        quantity: 0,
    },
    quote :{
        orderId : 0,
        price: 0,
        shippingCost : 0,
        downpayment : 0,
    },
    purchase :{
        quoteId : 0
    },
    ship :{
        purchaseId : 0
    },
    deliver :{
        shippingId : 0
    },


    productPrice: 0,
    harvesterID: "0x0000000000000000000000000000000000000000",
    shipperID: "0x0000000000000000000000000000000000000000",
    buyerID: "0x0000000000000000000000000000000000000000",
    state: "",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.harvest.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.harvest.originBeekeeperID = $("#originBeekeeperID").val();
        App.harvest.originBeekeeperName = $("#originBeekeeperName").val();
        App.harvest.originFarmInformation = $("#originFarmInformation").val();
        App.harvest.originFarmLatitude = $("#originFarmLatitude").val();
        App.harvest.originFarmLongitude = $("#originFarmLongitude").val();
        App.harvest.harvestQuantity = $("#harvestQuantity").val();
        App.harvest.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.harvesterID = $("#harvesterID").val();
        App.shipperID = $("#shipperID").val();
        App.buyerID = $("#buyerID").val();

        //PlaceOrder
        App.harvestQuantity = $("#harvestQuantity").val();
        App.productNotes = $("#productNotes").val();

        console.log(
            App.harvest.sku,
            App.upc,
            App.ownerID,
            App.harvest.originBeekeeperID,
            App.harvest.originBeekeeperName,
            App.harvest.originFarmInformation,
            App.harvest.originFarmLatitude,
            App.harvest.originFarmLongitude,
            App.harvest.harvestQuantity,
            App.harvest.productNotes,
            App.productPrice,
            App.harvesterID,
            App.shipperID,
            App.buyerID
        );
    },

    readHarvestForm: function () {
        App.harvest.sku = 0;
        App.upc = $("#harvestUpc").val();
        App.ownerID = $("#ownerID").val();
        App.harvest.originBeekeeperID = $("#originBeekeeperID").val();
        App.harvest.originBeekeeperName = $("#originBeekeeperName").val();
        App.harvest.originFarmInformation = $("#originFarmInformation").val();
        App.harvest.originFarmLatitude = $("#originFarmLatitude").val();
        App.harvest.originFarmLongitude = $("#originFarmLongitude").val();
        App.harvest.harvestQuantity = $("#harvestQuantity").val();
        App.harvest.productNotes = $("#productNotes").val();
    },

    readOrderForm: function () {
        App.upc = $("#orderUpc").val();
        App.order.quantity = $("#orderQuantity").val();
    },

    readQuoteForm: function () {
        App.quote.orderId = $("#orderId").val();
        App.quote.price = $("#orderPrice").val();
        App.quote.shippingCost = $("#orderShippingCost").val();
        App.quote.downpayment = $("#orderDownpayment").val();
    },

    readPurchaseForm: function () {
        App.purchase.quoteId = $("#purchaseQuoteId").val();
    },

    readShipForm: function () {
        App.ship.purchaseId = $("#shipPurchaseId").val();
    },

    readDeliverForm: function () {
        App.deliver.shippingId = $("#deliverShippingId").val();
    },

    assignShippingDetails: function (shipping){
        $("#shipPurchaseId").val(shipping[2]);
    },

    assignPurchaseDetails: function (purchase){
        $("#purchaseQuoteId").val(purchase[1]);
    },

    assignQuoteDetails: function (quote){
        $("#orderId").val(quote[1]);
    },

    assignOrderDetails: function (order){
        $("#orderUpc").val(order[2]);
    },

    initWeb3: async function () {
        // Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
            console.log('Loaded Ganache')
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../build/contracts/SupplyChain.json';


        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            //App.fetchHarvest();
            //App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        //Tabs.showForm("productOverview")

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = $(event.target).data('id');
        console.log('processId',processId);

        switch(processId) {
            case "harvest":
                App.readHarvestForm();
                const resultHarvestTx = await SupplyChainWrite.harvestItem(event);
                Display.showTx(resultHarvestTx);
                return;
            case "placeOrder":
                App.readOrderForm();
                const resultOrderTx = await SupplyChainWrite.placeOrder(event);
                Display.showTx(resultOrderTx);
                return;
            case "sendQuote":
                App.readQuoteForm();
                const resultQuoteTx = await SupplyChainWrite.sendQuote(event);
                Display.showTx(resultQuoteTx);
                return;
            case "purchase":
                App.readPurchaseForm();
                const resultPurchaseTx = await SupplyChainWrite.purchase(event);
                Display.showTx(resultPurchaseTx);
                return;
            case "ship":
                App.readShipForm();
                const resultShipTx = await SupplyChainWrite.ship(event);
                Display.showTx(resultShipTx);
                return;
            case "deliver":
                App.readDeliverForm();
                const resultDeliverTx = await SupplyChainWrite.deliver(event);
                Display.showTx(resultDeliverTx);
                return;
            case "fetchHarvest":
                App.readHarvestForm();
                const result = await SupplyChainRead.fetchHarvest(event);
                Tabs.showContainer("productSummary", true)
                Display.showHarvest(result);
                return;
            case "displayHarvestDetails":
                App.readOrderForm()
                const harvest = await SupplyChainRead.fetchHarvest(event)
                Display.showHarvestDetails(harvest);
                return;
            case "displayOrderDetails":
                App.readQuoteForm();
                const order = await SupplyChainRead.fetchOrder(event)
                App.assignOrderDetails(order);
                Display.showOrderDetails(order);
                return;
            case "displayQuoteDetails":
                App.readPurchaseForm();
                const quote = await SupplyChainRead.fetchQuote(event);
                App.assignQuoteDetails(quote);
                Display.showQuoteDetails(quote);
                return;
            case "displayPurchaseDetails":
                App.readShipForm();
                const purchase = await SupplyChainRead.fetchPurchase(event);
                App.assignPurchaseDetails(purchase);
                Display.showPurchaseDetails(purchase);
                return;
            case "displayShippingDetails":
                App.readDeliverForm()
                const shipping = await SupplyChainRead.fetchShipment(event)
                App.assignShippingDetails(shipping);
                Display.showShippingDetails(shipping);
                return;
            case "displayDeliverDetails":
                Display.showDeliveryDetails(await SupplyChainRead.fetchHarvest(event));
                return;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case "retrieveProduct":
                return await Tabs.showForm("productOverview");

            case "harvestForm":
                return await Tabs.showForm("harvest");

            case "loadPlaceOrderForm":
                return await Tabs.showForm("placeOrder");

            case "loadSendQuoteForm":
                return await Tabs.showForm("sendQuote");

            case "loadPurchaseForm":
                return await Tabs.showForm("purchase");

            case "loadShipForm":
                return await Tabs.showForm("ship");

            case "loadDeliverForm":
                return await Tabs.showForm("deliver");

            case 107:
                return await Tabs.showForm("transactionHistory");

            case "backHome":
                return await Tabs.showForm("home", true);


            }
    },





    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },



    addMessage: function(id) {

    },



    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.at(App.contract).then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});