
var Tabs = {
    showForm: function(state) {
        if (App.state == state){
            return
        }

        if (App.state != "home"){
            Tabs.showContainer("BackHome", true)
        }

        Tabs.showContainer("home", false);
        Tabs.showContainer("productSummary", false);
        Tabs.showContainer("productOverview", false);
        Tabs.showContainer("harvestForm", false);
        Tabs.showContainer("placeOrderForm", false);
        Tabs.showContainer("sendQuoteForm", false);
        Tabs.showContainer("purchaseForm", false);
        Tabs.showContainer("shipForm", false);
        Tabs.showContainer("deliverForm", false);
        Tabs.showContainer("transactionHistory", false);


        switch(state) {
            case "home":
                Tabs.showContainer("home", true);
                Tabs.showContainer("BackHome", false)
                break;
            case "productOverview":
                Tabs.showContainer("productOverview", true);
                break;
            case "harvest":
                Tabs.showContainer("harvestForm", true);
                break;
            case "placeOrder":
                Tabs.showContainer("placeOrderForm", true);
                break;
            case "sendQuote":
                Tabs.showContainer("sendQuoteForm", true);
                break;
            case "purchase":
                Tabs.showContainer("purchaseForm", true);
                break;
            case "ship":
                Tabs.showContainer("shipForm", true);
                break;
            case "deliver":
                Tabs.showContainer("deliverForm", true);
                break;
            case "transactionHistory":
                Tabs.showContainer("transactionHistory", true);
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
};