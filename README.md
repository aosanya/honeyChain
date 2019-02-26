# honeyChain
HoneyChain is a blockchain solution to facilitate the process of harvesting to delivery.

## unit Test
The unit tests are located in the test\TestSupplychain.js file

# Deployed smart contract on public test network (Rinkeby)
The deployed contract address is : 0xdabdf31eb842269a089bf05749ee86ef1fed9e52

##Sample Addresses
Owner     : 0x27D8D15CbC94527cAdf5eC14B69519aE23288B95
Harvester : 0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
Beekeeper : 0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A
Buyer     : 0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A
Shipper   : 0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A

##Transaction Samples
Add Harvester            : 0x5e9fcafe0fc5be1b29249e6adae98f7c9635c2ad3eaed28e92c936089f66eeaf
Harvested Honey          : 0x2862e9779b7409f45a95f80f95b41f70c91a42213113b708ec10edbe94cad709
Buyer Places Order       : 0x8b159c274e281e0f7593e0ebb514d4108d34f4fcffa651e7d9290491696c23eb
Harvester Sends Quote    : 0x27417ad7a6d8dc8f473f30eec8fe80e317f548bd5916cdf0213851dcfe4b67ce
Buyer Puchase            : 0x313bcd9a6992ea9224503bd23860fe96d084edbe750d5c1540ecd08126d613f4
Shipper Ships(Payable)   : 0xbb3c3f66fea8028383d149e7adc1bc5197311464a30f5c6cecb3f8f2564d9bd7
Shipper Delivers(Payable): 0x7d380f66b1b1eff9b8ce57d4d30fc28970c2e631e129e0ddcc67c9523473c2b6

# Testing on the Rinkeby Network
Navigate to the \Project-6 folder
Start the http-server by
`
    npm run dev
`
##Load Contract
The home page provides contract entry points.
Either Create a New contract by clicking the "Create New Contract" button
Or load existing contract by clicking the "Load Exising Contract" button
   enter the contract address and fetch it by clicking the "Load Contract" button
If successful, more actions will be visible : Add Harvester, Retrieve Product, Harvest,
Place Order, Send Quote, Purchase, Ship, Deliver

##Add Harvester
Click on the "Add Harvester" button from the home page
Complete the form by entering the
    Harvester Address
and click "Add Harvester" Button

##Harvest
Change metamask account to Harvester, otherwise the harvest operation will be not succeed
Click on the "Harvest" button from the home page
Complete the form by entering the
    UPC
    Beekeeper ID
    Farm Name
    Farm Information
    Farm Latitude
    Farm Longitude
    Quantity
    Product Notes
and click "Harvest" Button

##Place Order
Change metamask account to a buyer account
Click on the "Place Order" button from the home page
Complete the form by entering the
    UPC
    Quantity
and click "Place Order" button

##Send Quote
Change metamask account to Harvester, otherwise the send quote operation will be not succeed
Click on the "Send Quote" button from the home page
Complete the form by entering the
    Order Id
    Price
    Shipper ID
    Shipping Cost
    Shipping Downpayment
and click "Send Quote" button

##Purchase
Change metamask account to a buyer account
Click on the "Purchase" button from the home page
Complete the form by entering the
    Quote Id
and click "Purchase" button

##Ship
Change metamask account to the account set in the send quote stage
Click on the "Ship" button from the home page
Complete the form by entering the
    Purchase Id
and click "Ship" button

##Deliver
Change metamask account to a buyer account
Click on the "Purchase" button from the home page
Complete the form by entering the
    Quote Id
and click "Purchase" button