/*
 * SPDX-License-Identifier: Apache-2.0
 */

/*
     Invoke Commands:
         initLedger()
         createItem(itemId, ownerId)
            createItemListing(listingId, reservePrice, description, state=['FOR_SALE','RESERVE_NOT_MET','SOLD'], itemId)
         createMember(ownerId, firstname, lastname, balance)
         makeOffer(bid, listingId, memId)
         closeBidding(listingId)
*/

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // await contract.submitTransaction('initLedger');
        // await contract.submitTransaction('createItem', '234567', 'MEM2');
        // await contract.submitTransaction('createItemListing', 'LOT4', '2000', 'Honda Civic', 'FOR_SALE', '234567');
        // await contract.submitTransaction('makeOffer', '4500', 'LOT1', 'MEM3');
        await contract.submitTransaction('closeBidding', 'LOT1');
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
