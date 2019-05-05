/*
 * SPDX-License-Identifier: Apache-2.0
 */

/*
     Invoke Commands:
         initLedger()
         addMemToState(firstname, lastname, balance, [ownerId])
         createListing(reservePrice, description, [ownerId])
         makeOffer(bid, listingId, [memId])
         closeBidding(listingId)
*/

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

let user;
let fname;
let lname;
let balance;
process.argv.forEach(function (val,index,array) {
    user = array[2];
    fname = array[3];
    lname = array[4];
    balance = array[5];
});

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user ${user} does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        await contract.submitTransaction('addMemToState', fname, lname, balance, user);
        console.log('Added member.');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();