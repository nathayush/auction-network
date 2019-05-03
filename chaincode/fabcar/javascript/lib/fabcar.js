/*
 * SPDX-License-Identifier: Apache-2.0
 */

/*
    Invoke Commands:
        initLedger()
        addMemToState(firstname, lastname, balance, ownerId)
        createListing(reservePrice, description, ownerId)
        makeOffer(bid, listingId, memId)
        closeBidding(listingId)
    Query Commands:
        queryLot(query)
        queryMember(query)
        queryAll()
*/

'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        // let member1 = {};
        // member1.balance = 5000;
        // member1.firstName = 'Amy';
        // member1.lastName = 'Williams';

        // let lot1 = {};
        // lot1.owner = 'MEM1';
        // lot1.reservePrice = 3500;
        // lot1.description = 'Arium Nova';
        // lot1.listingState = 'FOR_SALE';
        // lot1.offers = '';
        // lot1.item = 'item1';

        let lotCount = {};
        lotCount.count = 0;

        let memCount = {};
        memCount.count = 0;

        await ctx.stub.putState('lotCount', Buffer.from(JSON.stringify(lotCount)));
        await ctx.stub.putState('memCount', Buffer.from(JSON.stringify(memCount)));

        console.info('============= END : Initialize Ledger ===========');
    }

    async addMemToState(ctx, firstName, lastName, balance, memberId) {
      console.info('============= START : Add Member to State ===========');
      if (memberId == null || firstName == null || lastName == null || balance == null) {
        throw new Error('Incorrect number of arguments. Expecting 4');
      }

      var member = {
        firstName: firstName,
        lastName: lastName,
        balance: balance
      };

      console.info(member);

      await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));

      let countAsBytes = await ctx.stub.getState('memCount');
      var memCount = JSON.parse(countAsBytes);
      memCount.count = memCount.count + 1;
      await ctx.stub.putState('memCount', Buffer.from(JSON.stringify(memCount)));

      console.info('============= END : Add Member to State ===========');
    }

    async createListing(ctx, reservePrice, description, ownerId) {
      console.info('============= START : Create Listing ===========');
      if (ownerId == null || reservePrice == null || description == null) {
        throw new Error('Incorrect number of arguments. Expecting 4');
      }

      var itemListing = {
        owner: ownerId,
        reservePrice: reservePrice,
        description: description,
        listingState: 'FOR_SALE',
        offers: null
      };

      let countAsBytes = await ctx.stub.getState('lotCount');
      var lotCount = JSON.parse(countAsBytes);
      lotCount.count = lotCount.count + 1;

      var listingId = "LOT" + lotCount.count.toString();

      await ctx.stub.putState(listingId, Buffer.from(JSON.stringify(itemListing)));
      await ctx.stub.putState('lotCount', Buffer.from(JSON.stringify(lotCount)));

      console.info('============= END : Create Listing ===========');
    }

    async queryLot(ctx, query) {
      console.info('============= START : Query method ===========');
      if (query == null) {
        throw new Error('Incorrect number of arguments. Expecting 1');
      }

      let queryAsBytes = await ctx.stub.getState(query);
      if (!queryAsBytes || queryAsBytes.toString().length <= 0) {
        throw new Error('key does not exist: ');
      }
      console.info('query response: ');
      console.info(queryAsBytes.toString());
      console.info('============= END : Query method ===========');

      return queryAsBytes.toString();
    }

    async queryMember(ctx, query) {
      console.info('============= START : Query method ===========');
      if (query == null) {
        throw new Error('Incorrect number of arguments. Expecting 1');
      }

      let queryAsBytes = await ctx.stub.getState(query); //get the car from chaincode state
      if (!queryAsBytes || queryAsBytes.toString().length <= 0) {
        throw new Error('key does not exist: ');
      }
      console.info('query response: ');
      console.info(queryAsBytes.toString());
      console.info('============= END : Query method ===========');

      return queryAsBytes.toString();
    }

    // async queryMemberOffers(ctx, query) {
    //   console.info('============= START : Query method ===========');
    //   const startLot = 'LOT0';
    //   const endLot = 'LOT999';
    //
    //   const lotIterator = await ctx.stub.getStateByRange(startLot, endLot);
    //
    //   const allResults = [];
    //   while (true) {
    //     const res = await lotIterator.next();
    //
    //     if (res.value && res.value.value.toString()) {
    //       console.log(res.value.value.toString('utf8'));
    //
    //       const Key = res.value.key;
    //       let Record;
    //       try {
    //         var listing = JSON.parse(res.value.value.toString('utf8'));
    //         if (listing.offers && listing.offers.length > 0) {
    //           listing.offers.sort(function (a, b) {
    //             return (b.bidPrice - a.bidPrice);
    //           });
    //
    //           function getRank(value, index, array) {
    //             if (value.member == query) {
    //               allResults.push({Key, "Rank " + index.toString()})
    //             }
    //           }
    //           listing.offers.forEach(myFunction);
    //         }
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     }
    //     if (res.done) {
    //       await lotIterator.close();
    //       break;
    //     }
    //   }
    //   console.log('end of data');
    //   console.info(allResults);
    //   console.info('============= END : Query method ===========');
    //
    //   return JSON.stringify(allResults);
    // }

    async queryAll(ctx) {
      console.info('============= START : Query method ===========');
      const startLot = 'LOT0';
      const endLot = 'LOT999';

      const lotIterator = await ctx.stub.getStateByRange(startLot, endLot);

      const allResults = [];
      while (true) {
        const res = await lotIterator.next();

        if (res.value && res.value.value.toString()) {
          console.log(res.value.value.toString('utf8'));

          const Key = res.value.key;
          let Record;
          try {
            Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            Record = res.value.value.toString('utf8');
          }
          allResults.push({ Key, Record });
        }
        if (res.done) {
          await lotIterator.close();
          break;
        }
      }
      console.log('end of data');
      console.info(allResults);
      console.info('============= END : Query method ===========');

      return JSON.stringify(allResults);
    }

    async makeOffer(ctx, bid, listingId, memberId) {
      console.info('============= START : Make Offer ===========');
      if (bid == null || listingId == null || memberId == null) {
        throw new Error('Incorrect number of arguments. Expecting 3');
      }

      var offer = {
        bidPrice: bid,
        listing: listingId,
        member: memberId
      };

      let listing = listingId;
      console.info('listing: ' + listing);

      //get reference to listing, to add the offer to the listing later
      let listingAsBytes = await ctx.stub.getState(listing);
      if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
        throw new Error('listing does not exist');
      }
      listing = JSON.parse(listingAsBytes);

      //get reference to member to ensure enough balance in their account to make the bid
      let memberAsBytes = await ctx.stub.getState(offer.member);
      if (!memberAsBytes || memberAsBytes.toString().length <= 0) {
        throw new Error('member does not queryexist');
      }
      let member = JSON.parse(memberAsBytes);

      //check to ensure bidder has enough balance to make the bid
      if (member.balance < offer.bidPrice) {
        throw new Error('The bid is higher than the balance in your account!');
      }

      console.info('offer: ');
      console.info(util.inspect(offer, { showHidden: false, depth: null }));

      //check to ensure bidder can't bid on own item!
      if (listing.owner == offer.member) {
        throw new Error('owner cannot bid on own item.');
      }

      console.info('listing response before pushing to offers: ');
      console.info(listing);
      if (!listing.offers) {
        console.info('there are no offers.');
        listing.offers = [];
      }
      listing.offers.push(offer);

      var result = '';
      if (listing.offers && listing.offers.length > 0) {
        listing.offers.sort(function (a, b) {
          return (b.bidPrice - a.bidPrice);
        });
        listing.offers.forEach(function (value, index) {
          if (value.member == offer.member) {
            result = "rank in this lot's bids: " + (Number(index)+1).toString();
          }
        });
      }

      console.info('listing response after pushing to offers: ');
      console.info(listing);
      await ctx.stub.putState(listingId, Buffer.from(JSON.stringify(listing)));
      console.info('============= END : Make Offer ===========');
      return result;
    }

    async closeBidding(ctx, listingId) {
      console.info('============= START : Close bidding ===========');
      if (listingId == null) {
        throw new Error('Incorrect number of arguments. Expecting 1');
      }

      let listingKey = listingId;

      //check if listing exists
      let listingAsBytes = await ctx.stub.getState(listingKey);
      if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
        throw new Error('listing does not exist.');
      }
      console.info('============= listing exists ===========');

      var listing = JSON.parse(listingAsBytes);
      console.info('listing: ');
      console.info(util.inspect(listing, { showHidden: false, depth: null }));
      listing.listingState = 'RESERVE_NOT_MET';
      let highestOffer = null;
      let secondHighestOffer = null;

      //can only close bidding if there are offers
      if (listing.offers && listing.offers.length > 1) {
        listing.offers.sort(function (a, b) {
          return (b.bidPrice - a.bidPrice);
        });

        highestOffer = listing.offers[0];
        secondHighestOffer = listing.offers[1];
        console.info('highest Offer: ' + highestOffer);
        console.info('second Highest Offer: ' + secondHighestOffer);

        //bid must be higher than reserve price, otherwise we can sell the car
        if (highestOffer.bidPrice >= listing.reservePrice) {
          let buyer = highestOffer.member;
          console.info('highestOffer.member: ' + buyer);

          //get the buyer or highest bidder on the item
          let buyerAsBytes = await ctx.stub.getState(buyer);
          if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
            throw new Error('buyer does not exist in the network');
          }
          buyer = JSON.parse(buyerAsBytes);
          console.info('buyer: ');
          console.info(util.inspect(buyer, { showHidden: false, depth: null }));

          let sellerAsBytes = await ctx.stub.getState(listing.owner);
          if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
            throw new Error('Seller does not exist in network');
          }
          let seller = JSON.parse(sellerAsBytes);

          console.info('seller: ');
          console.info(util.inspect(seller, { showHidden: false, depth: null }));

          console.info('#### seller balance before: ' + seller.balance);
          console.info('#### buyer balance before: ' + buyer.balance);
          //ensure all strings get converted to ints
          let sellerBalance = parseInt(seller.balance, 10);
          let secondHighOfferBidPrice = parseInt(secondHighestOffer.bidPrice, 10);
          let buyerBalance = parseInt(buyer.balance, 10);

          sellerBalance += secondHighOfferBidPrice;
          seller.balance = sellerBalance;
          buyerBalance -= secondHighestOffer.bidPrice;
          buyer.balance = buyerBalance;
          let oldOwner = listing.owner;
          listing.owner = highestOffer.member;

          console.info('#### seller balance after: ' + seller.balance);
          console.info('#### buyer balance after: ' + buyerBalance);
          console.info('#### lot owner before: ' + listing.owner);
          console.info('#### lot owner after: ' + listing.owner);
          console.info('#### buyer balance after: ' + buyerBalance);
          listing.offers = null;
          listing.listingState = 'SOLD';

          //update the balance of the buyer
          await ctx.stub.putState(highestOffer.member, Buffer.from(JSON.stringify(buyer)));
          //update the balance of the seller
          await ctx.stub.putState(oldOwner, Buffer.from(JSON.stringify(seller)));
          // update the listing
          await ctx.stub.putState(listingKey, Buffer.from(JSON.stringify(listing)));
        }
      } else if (listing.offers && listing.offers.length > 0) {
        listing.offers.sort(function (a, b) {
          return (b.bidPrice - a.bidPrice);
        });

        highestOffer = listing.offers[0];
        console.info('highest Offer: ' + highestOffer);

        //bid must be higher than reserve price, otherwise we can sell the car
        if (highestOffer.bidPrice >= listing.reservePrice) {
          let buyer = highestOffer.member;
          console.info('highestOffer.member: ' + buyer);

          //get the buyer or highest bidder on the item
          let buyerAsBytes = await ctx.stub.getState(buyer);
          if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
            throw new Error('buyer does not exist in network');
          }
          buyer = JSON.parse(buyerAsBytes);
          console.info('buyer: ');
          console.info(util.inspect(buyer, { showHidden: false, depth: null }));

          let sellerAsBytes = await ctx.stub.getState(listing.owner);
          if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
            throw new Error('Seller does not exist in network');
          }
          let seller = JSON.parse(sellerAsBytes);

          console.info('seller: ');
          console.info(util.inspect(seller, { showHidden: false, depth: null }));

          console.info('#### seller balance before: ' + seller.balance);
          console.info('#### buyer balance before: ' + buyer.balance);
          //ensure all strings get converted to ints
          let sellerBalance = parseInt(seller.balance, 10);
          let highOfferBidPrice = parseInt(highestOffer.bidPrice, 10);
          let buyerBalance = parseInt(buyer.balance, 10);

          sellerBalance += highOfferBidPrice;
          seller.balance = sellerBalance;
          buyerBalance -= highestOffer.bidPrice;
          buyer.balance = buyerBalance;
          let oldOwner = listing.owner;
          listing.owner = highestOffer.member;

          console.info('#### seller balance after: ' + seller.balance);
          console.info('#### buyer balance after: ' + buyerBalance);
          console.info('#### item owner before: ' + listing.owner);
          console.info('#### item owner after: ' + listing.owner);
          console.info('#### buyer balance after: ' + buyerBalance);
          listing.offers = null;
          listing.listingState = 'SOLD';

          //update the balance of the buyer
          await ctx.stub.putState(highestOffer.member, Buffer.from(JSON.stringify(buyer)));
          //update the balance of the seller
          await ctx.stub.putState(oldOwner, Buffer.from(JSON.stringify(seller)));
          // update the listing
          await ctx.stub.putState(listingKey, Buffer.from(JSON.stringify(listing)));
        }
      }
      console.info('inspecting lot: ');
      console.info(util.inspect(listing, { showHidden: false, depth: null }));

      if (!highestOffer) {
        throw new Error('no offers exist');
      }

      console.info('============= END : closeBidding ===========');
    }
}

module.exports = FabCar;
