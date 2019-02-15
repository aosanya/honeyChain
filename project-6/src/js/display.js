var Display = {
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
    }
}