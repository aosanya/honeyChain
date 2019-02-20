
var Display = {
    alternating : false,

    showHarvest : function(harvest) {
        console.log(harvest)

        $("#harvestUpc").val(harvest[1])
        $("#originBeekeeperID").val(harvest[4])
        $("#originBeekeeperName").val(harvest[5])
        $("#originFarmInformation").val(harvest[6])
        $("#originFarmLatitude").val(harvest[7])
        $("#originFarmLongitude").val(harvest[8])
        $("#harvestQuantity").val(harvest[9])

        $("#summary").empty();
        $("#summary").append(Display.formatSummary("SKU", harvest[0]));
        $("#summary").append(Display.formatSummary("UPC", harvest[1]));
        $("#summary").append(Display.formatSummary("Harvester", harvest[2]));
        $("#summary").append(Display.formatSummary("Owner Id", harvest[3]));
        $("#summary").append(Display.formatSummary("Bee Keeper Id", harvest[4]));
        $("#summary").append(Display.formatSummary("Bee Keeper Name", harvest[5]));
        $("#summary").append(Display.formatSummary("Bee Keeper Info", harvest[6]));
        $("#summary").append(Display.formatSummary("Farm Latitude", harvest[7]));
        $("#summary").append(Display.formatSummary("Farm Longitude", harvest[8]));
        $("#summary").append(Display.formatSummary("Quantity", harvest[9]));
    },


    formatSummary : function(name, value) {
        return '<li>' + name + ' <div class="Info">' + value + '</div></li>'
    },

    showTx : function(harvestTx) {
        console.log(harvestTx);
        $("#ftc-item").text(harvestTx);
    },

    showHarvestDetails : function(harvest) {
        const targetName = "[name='HarvestDetails']";
        $(targetName).removeClass("Hidden")
        $(targetName).empty();
        $(targetName).append("<div class='header'>Harvest Details</div>");
        $(targetName).append(Display.formatDetailSummary("SKU", harvest[0]));
        $(targetName).append(Display.formatDetailSummary("UPC", harvest[1]));
        $(targetName).append(Display.formatDetailSummary("Harvester", harvest[2]));
        $(targetName).append(Display.formatDetailSummary("Owner Id", harvest[3]));
        $(targetName).append(Display.formatDetailSummary("Bee Keeper Id", harvest[4]));
        $(targetName).append(Display.formatDetailSummary("Bee Keeper Name", harvest[5]));
        $(targetName).append(Display.formatDetailSummary("Bee Keeper Info", harvest[6]));
        $(targetName).append(Display.formatDetailSummary("Farm Latitude", harvest[7]));
        $(targetName).append(Display.formatDetailSummary("Farm Longitude", harvest[8]));
        $(targetName).append(Display.formatDetailSummary("Harvest Quantity", harvest[9]));
    },

    showOrderDetails : function(order) {
        const targetName = "[name='OrderDetails']";
        $(targetName).removeClass("Hidden")
        $(targetName).empty();
        $(targetName).append("<div class='header'>Order Details</div>");
        $(targetName).append(Display.formatDetailSummary("Order Id", order[0]));
        $(targetName).append(Display.formatDetailSummary("Buyer Id", order[1]));
        $(targetName).append(Display.formatDetailSummary("Order Quantity", order[3]));
        $(targetName).append(Display.formatDetailSummary("UPC", order[2] + '<span class="btn-SubInfo glyphicon glyphicon-zoom-in" data-id="displayHarvestDetails"></span>'));
        $(targetName).append(Display.addDetails("HarvestDetails"));
    },

    showQuoteDetails : function(quote) {
        const targetName = "[name='QuoteDetails']";
        $(targetName).removeClass("Hidden")
        $(targetName).empty();
        $(targetName).append("<div class='header'>Quote Details</div>");
        $(targetName).append(Display.formatDetailSummary("Quote Id", quote[0]));
        $(targetName).append(Display.formatDetailSummary("Price", quote[2]));
        $(targetName).append(Display.formatDetailSummary("Shipping Cost", quote[3]));
        $(targetName).append(Display.formatDetailSummary("Downpayment", quote[4]));
        $(targetName).append(Display.formatDetailSummary("Date Quoted", quote[5]));
        $(targetName).append(Display.formatDetailSummary("Order Id", quote[1] + '<span class="btn-SubInfo glyphicon glyphicon-zoom-in" data-id="displayOrderDetails"></span>'));
        $(targetName).append(Display.addDetails("OrderDetails"));
    },

    showPurchaseDetails : function(purchase) {
        const targetName = "[name='PurchaseDetails']";
        $(targetName).removeClass("Hidden")
        $(targetName).empty();
        $(targetName).append("<div class='header'>Purchase Details</div>");
        // $(targetName).append(Display.formatDetailSummary("Purchase Id", purchase[0]));
        $(targetName).append(Display.formatDetailSummary("Date Purchased", purchase[2]));
        $(targetName).append(Display.formatDetailSummary("Quote Id", purchase[1] + '<span class="btn-SubInfo glyphicon glyphicon-zoom-in" data-id="displayQuoteDetails"></span>'));
        $(targetName).append(Display.addDetails("QuoteDetails"));
    },

    showShippingDetails : function(shipping) {
        const targetName = "[name='ShippingDetails']";
        $(targetName).removeClass("Hidden")
        $(targetName).empty();
        $(targetName).append("<div class='header'>Shipping Details</div>");
        $(targetName).append(Display.formatDetailSummary("Shipment Id", shipping[0]));
        $(targetName).append(Display.formatDetailSummary("Shipper Id", shipping[1]));
        $(targetName).append(Display.formatDetailSummary("Date Shipped", shipping[3]));
        $(targetName).append(Display.formatDetailSummary("Delivered", shipping[4]));
        $(targetName).append(Display.formatDetailSummary("Date Delivered", shipping[5]));
        $(targetName).append(Display.formatDetailSummary("Purchase Id", shipping[2] + '<span class="btn-SubInfo glyphicon glyphicon-zoom-in" data-id="displayPurchaseDetails"></span>'));
        $(targetName).append(Display.addDetails("PurchaseDetails"));

        Display.show("[name='deliverButton']", !shipping[4])
        Display.show("[name='deliverMessage']", shipping[4])
        $("[name='deliverMessage']").append("Already Delivered!")
    },

    showDeliveryDetails : function(delivery) {
        const targetName = "[name='DeliveryDetails']";
        $(targetName).removeClass("Hidden")
        $(targetName).empty();
        $(targetName).append("<div class='header'>Delivery Details</div>");
        $(targetName).append(Display.formatDetailSummary("Shipment Id", delivery[0]));
        $(targetName).append(Display.formatDetailSummary("Shipper Id", delivery[1]));
        $(targetName).append(Display.formatDetailSummary("Purchase Id", delivery[2]));
        $(targetName).append(Display.formatDetailSummary("Date Shipped", delivery[3]));
        $(targetName).append(Display.formatDetailSummary("Delivered", delivery[4]));
        $(targetName).append(Display.formatDetailSummary("Date Delivered", delivery[5]));


    },

    formatDetailSummary : function(name, value) {
        Display.alternating = !Display.alternating;
        const style = Display.alternating ? "alternating" : "";
        return '<div class="detail ' + style + '"><div class="detailTitle">' + name + '</div><div>' + value + '</div></div>'
    },

    addDetails : function(name) {
        return '<div class="details Hidden" name="' + name + '"></div>'
    },

    show: function(selector, visible) {
        if(!visible){
            $(selector).addClass("Hidden")
        }
        else{
            $(selector).removeClass("Hidden")
        }
    },

}