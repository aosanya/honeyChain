App = {
    contract: null,
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
    harvesterAddress: "0x0000000000000000000000000000000000000000",
    shipperAddress: "0x0000000000000000000000000000000000000000",
    buyerAddress: "0x0000000000000000000000000000000000000000",
    state: "",

    init: async function () {
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    createNewContract: async function () {
        console.log("Creating New Contract");

        SupplyChainWrite.createNewContract(App.contractCreated)//.then(function(data) {
        //     console.log(data)
        //     App.contract = data;
        //     console.log("fetching Events " + App.contract);
        //     App.fetchEvents();
        // }).catch(function(err) {

        // });
    },

    contractCreated: function (instance) {
        App.contract = instance.contract.address;
        console.log(App.contract);
        App.loadContract();
    },

    loadContract: function () {
        App.fetchEvents();
        Display.showContract();
    },

    readLoadContractForm: function () {
        App.contract = $("#contractAddress").val();
    },

    readAddHarvesterForm: function () {
        App.harvesterAddress = $("#addHarvester_HarvesterAddress").val();
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
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchEvents();

        });


        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {

        event.preventDefault();

        var processId = $(event.target).data('id');
        console.log('processId',processId);

        if (processId == undefined){
            return
        }

        Display.showLoadingBar();
        Display.removeMessages();

        App.getMetaskAccountID();
        //$(event.target).addClass("blink");
        switch(processId) {
            case "createNewContract":
                App.createNewContract();
                break;
            case "loadContract":
                Tabs.showForm("home", true);
                App.readLoadContractForm();
                App.loadContract();
                break;
            case "addHarvester":
                App.readAddHarvesterForm();
                const resultAddHarvesterTx = await SupplyChainWrite.addHarvester(event);
                Display.showTx(resultAddHarvesterTx, "addHarvesterMessage");
                break;
            case "harvest":
                App.readHarvestForm();
                const resultHarvestTx = await SupplyChainWrite.harvestItem(event);
                Display.showTx(resultHarvestTx, "harvestMessage");
                break;
            case "placeOrder":
                App.readOrderForm();
                const resultOrderTx = await SupplyChainWrite.placeOrder(event);
                Display.showTx(resultOrderTx);
                break;
            case "sendQuote":
                App.readQuoteForm();
                const resultQuoteTx = await SupplyChainWrite.sendQuote(event);
                Display.showTx(resultQuoteTx);
                break;
            case "purchase":
                App.readPurchaseForm();
                const resultPurchaseTx = await SupplyChainWrite.purchase(event);
                Display.showTx(resultPurchaseTx);
                break;
            case "ship":
                App.readShipForm();
                const resultShipTx = await SupplyChainWrite.ship(event);
                Display.showTx(resultShipTx);
                break;
            case "deliver":
                App.readDeliverForm();
                const resultDeliverTx = await SupplyChainWrite.deliver(event);
                Display.showTx(resultDeliverTx);
                break;
            case "fetchHarvest":
                App.readHarvestForm();
                const result = await SupplyChainRead.fetchHarvest(event);
                Tabs.showContainer("productSummary", true)
                Display.showHarvest(result);
                break;
            case "displayHarvestDetails":
                App.readOrderForm()
                const harvest = await SupplyChainRead.fetchHarvest(event)
                Display.showHarvestDetails(harvest);
                break;
            case "displayOrderDetails":
                App.readQuoteForm();
                const order = await SupplyChainRead.fetchOrder(event)
                App.assignOrderDetails(order);
                Display.showOrderDetails(order);
                break;
            case "displayQuoteDetails":
                App.readPurchaseForm();
                const quote = await SupplyChainRead.fetchQuote(event);
                App.assignQuoteDetails(quote);
                Display.showQuoteDetails(quote);
                break;
            case "displayPurchaseDetails":
                App.readShipForm();
                const purchase = await SupplyChainRead.fetchPurchase(event);
                App.assignPurchaseDetails(purchase);
                Display.showPurchaseDetails(purchase);
                break;
            case "displayShippingDetails":
                App.readDeliverForm()
                const shipping = await SupplyChainRead.fetchShipment(event)
                App.assignShippingDetails(shipping);
                Display.showShippingDetails(shipping);
                break;
            case "displayDeliverDetails":
                Display.showDeliveryDetails(await SupplyChainRead.fetchHarvest(event));
                break;

            case 10:
                await App.fetchItemBufferTwo(event);
                break;
            //To Do Squash the next lines
            case "retrieveProduct":
                await Tabs.showForm("productOverview");
                break;
            case "loadContractForm":
                await Tabs.showForm("loadContractForm");
                break;
            case "loadAddHarvesterForm":
                await Tabs.showForm("loadAddHarvesterForm");
                break;
            case "harvestForm":
                await Tabs.showForm("harvest");
                break;
            case "loadPlaceOrderForm":
               await Tabs.showForm("placeOrder");
               break;
            case "loadSendQuoteForm":
                await Tabs.showForm("sendQuote");
                break;
            case "loadPurchaseForm":
               await Tabs.showForm("purchase");
               break;
            case "loadShipForm":
                await Tabs.showForm("ship");
                break;
            case "loadDeliverForm":
                await Tabs.showForm("deliver");
                break;
            case 107:
                await Tabs.showForm("transactionHistory");
                break;
            case "backHome":
                await Tabs.showForm("home", true);
                break;
            }
            Display.hideLoadingBar();
    },





    // packItem: function (event) {
    //     event.preventDefault();
    //     var processId = parseInt($(event.target).data('id'));

    //     App.contracts.SupplyChain.at(App.contract).then(function(instance) {
    //         return instance.packItem(App.upc, {from: App.metamaskAccountID});
    //     }).then(function(result) {
    //         $("#ftc-item").text(result);
    //         console.log('packItem',result);
    //     }).catch(function(err) {
    //         console.log(err.message);
    //     });
    // },

    // sellItem: function (event) {
    //     event.preventDefault();
    //     var processId = parseInt($(event.target).data('id'));

    //     App.contracts.SupplyChain.at(App.contract).then(function(instance) {
    //         const productPrice = web3.toWei(1, "ether");
    //         console.log('productPrice',productPrice);
    //         return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
    //     }).then(function(result) {
    //         $("#ftc-item").text(result);
    //         console.log('sellItem',result);
    //     }).catch(function(err) {
    //         console.log(err.message);
    //     });
    // },




    addMessage: function(id) {

    },

    fetchEvents: function () {
        if (App.contract == null){
            return
        }

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