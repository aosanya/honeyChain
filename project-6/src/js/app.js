App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originBeekeeperID: "0x0000000000000000000000000000000000000000",
    originBeekeeperName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    harvestQuantity: 0,
    productNotes: null,
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
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originBeekeeperID = $("#originBeekeeperID").val();
        App.originBeekeeperName = $("#originBeekeeperName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.harvestQuantity = $("#harvestQuantity").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.harvesterID = $("#harvesterID").val();
        App.shipperID = $("#shipperID").val();
        App.buyerID = $("#buyerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID,
            App.originBeekeeperID,
            App.originBeekeeperName,
            App.originFarmInformation,
            App.originFarmLatitude,
            App.originFarmLongitude,
            App.harvestQuantity,
            App.productNotes,
            App.productPrice,
            App.harvesterID,
            App.shipperID,
            App.buyerID
        );
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
        var jsonSupplyChain='sc/build/contracts/SupplyChain.json';

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

        App.showForm("productOverview")

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchHarvest(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 100:
                return await App.showForm("productOverview");
                break;
            case 101:
                return await App.showForm("harvest");
                break;
            case 102:
                return await App.showForm("placeOrder");
                break;
            case 103:
                return await App.showForm("sendQuote");
                break;
            case 104:
                return await App.showForm("purchase");
                break;
            case 105:
                return await App.showForm("ship");
                break;
            case 106:
                return await App.showForm("deliver");
                break;
            case 107:
                return await App.showForm("transactionHistory");
                break;
            }
    },

    harvestItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));



        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
            //return instance.harvestItem(2, App.metamaskAccountID, "12", "12", 1, 2, 10, "1")
            console.log(App)
            return instance.harvestItem(
                App.upc,
                App.metamaskAccountID,
                App.originBeekeeperName,
                App.originFarmInformation,
                App.originFarmLatitude,
                App.originFarmLongitude,
                App.harvestQuantity,
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    showForm: function(state) {
        if (App.state == state){
            return
        }

        App.showContainer("productOverview", false);
        App.showContainer("harvestForm", false);
        App.showContainer("placeOrderForm", false);
        App.showContainer("sendQuoteForm", false);
        App.showContainer("purchaseForm", false);
        App.showContainer("shipForm", false);
        App.showContainer("deliverForm", false);
        App.showContainer("transactionHistory", false);

        switch(state) {
            case "productOverview":
                App.showContainer("productOverview", true);
                break;
            case "harvest":
                App.showContainer("harvestForm", true);
                break;
            case "placeOrder":
                App.showContainer("placeOrderForm", true);
                break;
            case "sendQuote":
                App.showContainer("sendQuoteForm", true);
                break;
            case "purchase":
                App.showContainer("purchaseForm", true);
                break;
            case "ship":
                App.showContainer("shipForm", true);
                break;
            case "deliver":
                App.showContainer("deliverForm", true);
                break;
            case "transactionHistory":
                App.showContainer("transactionHistory", true);
                break;

            default:

        }
    },

    showContainer: function(name, visible) {
        if(!visible){
            $("#" + name).addClass("Hidden")
        }
        else{
            $("#" + name).removeClass("Hidden")
        }
    },

    fetchHarvest: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
          return instance.fetchHarvest(App.upc);
        }).then(function(result) {
          App.showHarvest(result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    showHarvest : function(harvest) {
        $("#summary").append(App.formatSummary("SKU", harvest[0]));
        $("#summary").append(App.formatSummary("UPC", harvest[1]));
        $("#summary").append(App.formatSummary("Harvester", harvest[2]));
        $("#summary").append(App.formatSummary("Owner Id", harvest[3]));
        $("#summary").append(App.formatSummary("Bee Keeper Id", harvest[4]));
        $("#summary").append(App.formatSummary("Bee Keeper Name", harvest[5]));
        $("#summary").append(App.formatSummary("Bee Keeper Info", harvest[6]));
        $("#summary").append(App.formatSummary("Farm Latitude", harvest[7]));
        $("#summary").append(App.formatSummary("Farm Longitude", harvest[8]));
        $("#summary").append(App.formatSummary("Quantity", harvest[9]));
    },

    formatSummary : function(name, value) {
        return '<li>' + name + ' <div class="Info">' + value + '</div></li>'
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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

        App.contracts.SupplyChain.at("0x23E2b13b08a22E9eEe431F862eC7A17aB1E99B98").then(function(instance) {
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