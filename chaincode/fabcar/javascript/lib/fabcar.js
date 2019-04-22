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
    Query Commands:
        queryLot(query)
        queryMember(query)
        queryItem(query)
        queryAll()
*/

'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        let member1 = {};
        member1.balance = 5000;
        member1.firstName = 'Amy';
        member1.lastName = 'Williams';

        let member2 = {};
        member2.balance = 5000;
        member2.firstName = 'Billy';
        member2.lastName = 'Thompson';

        let member3 = {};
        member3.balance = 5000;
        member3.firstName = 'Tom';
        member3.lastName = 'Werner';

        let item = {};
        item.owner = 'MEM1';

        let itemListing = {};
        itemListing.reservePrice = 3500;
        itemListing.description = 'Arium Nova';
        itemListing.listingState = 'FOR_SALE';
        itemListing.offers = '';
        itemListing.item = '123456';

        await ctx.stub.putState('MEM1', Buffer.from(JSON.stringify(member1)));
        await ctx.stub.putState('MEM2', Buffer.from(JSON.stringify(member2)));
        await ctx.stub.putState('MEM3', Buffer.from(JSON.stringify(member3)));
        await ctx.stub.putState('123456', Buffer.from(JSON.stringify(item)));
        await ctx.stub.putState('LOT1', Buffer.from(JSON.stringify(itemListing)));

        console.info('============= END : Initialize Ledger ===========');
    }

    async createItem(ctx, itemId, ownerId) {
      console.info('============= START : Create Item ===========');
      if (itemId == null || ownerId == null) {
        throw new Error('Incorrect number of arguments. Expecting 2');
      }

      var car = {
        owner: ownerId
      };

      await ctx.stub.putState(itemId, Buffer.from(JSON.stringify(car)));
      console.info('============= END : Create Item ===========');
    }

    async createItemListing(ctx, listingId, reservePrice, description, listingState, itemId) {
      console.info('============= START : Create Listing ===========');
      if (listingId == null || reservePrice == null || description == null || listingState == null || itemId == null) {
        throw new Error('Incorrect number of arguments. Expecting 6');
      }

      var itemListing = {
        reservePrice: reservePrice,
        description: description,
        listingState: listingState,
        offers: null,
        item: itemId
      };

      await ctx.stub.putState(listingId, Buffer.from(JSON.stringify(itemListing)));
      console.info('============= END : Create Listing ===========');
    }

    async createMember(ctx, memberId, firstName, lastName, balance) {
      console.info('============= START : Create Member ===========');
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
      console.info('============= END : Create Member ===========');
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

    async queryItem(ctx, query) {
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

      const startMem = 'MEM0';
      const endMem = 'MEM999';

      const memIterator = await ctx.stub.getStateByRange(startMem, endMem);

      while (true) {
        const res = await memIterator.next();

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
          await memIterator.close();
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

      //get reference to item, to update it's owner later
      let itemAsBytes = await ctx.stub.getState(listing.item);
      if (!itemAsBytes || itemAsBytes.toString().length <= 0) {
        throw new Error('item does not exist');
      }

      let item = JSON.parse(itemAsBytes);

      //get reference to member to ensure enough balance in their account to make the bid
      let memberAsBytes = await ctx.stub.getState(offer.member);
      if (!memberAsBytes || memberAsBytes.toString().length <= 0) {
        throw new Error('member does not exist');
      }
      let member = JSON.parse(memberAsBytes);

      //check to ensure bidder has enough balance to make the bid
      if (member.balance < offer.bidPrice) {
        throw new Error('The bid is higher than the balance in your account!');
      }

      console.info('item: ');
      console.info(util.inspect(item, { showHidden: false, depth: null }));
      console.info('offer: ');
      console.info(util.inspect(offer, { showHidden: false, depth: null }));


      //check to ensure bidder can't bid on own item!
      if (item.owner == offer.member) {
        throw new Error('owner cannot bid on own item.');
      }

      console.info('listing response before pushing to offers: ');
      console.info(listing);
      if (!listing.offers) {
        console.info('there are no offers! ');
        listing.offers = [];
      }
      listing.offers.push(offer);

      console.info('listing response after pushing to offers: ');
      console.info(listing);
      await ctx.stub.putState(listingId, Buffer.from(JSON.stringify(listing)));

      console.info('============= END : Make Offer ===========');
    }

    async closeBidding(ctx, listingId) {
      console.info('============= START : Close bidding ===========');
      if (listingId == null) {
        throw new Error('Incorrect number of arguments. Expecting 1');
      }

      let listingKey = listingId;
      console.log('1')
      //check if listing exists
      let listingAsBytes = await ctx.stub.getState(listingKey);
      if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
        throw new Error('listing does not exist: ');
      }
      console.info('============= listing exists ===========');
      console.log('2')

      var listing = JSON.parse(listingAsBytes);
      console.info('listing: ');
      console.info(util.inspect(listing, { showHidden: false, depth: null }));
      listing.listingState = 'RESERVE_NOT_MET';
      let highestOffer = null;
      let secondHighestOffer = null;
      console.log('3')
      //can only close bidding if there are offers
      if (listing.offers && listing.offers.length > 1) {
        listing.offers.sort(function (a, b) {
          return (b.bidPrice - a.bidPrice);
        });
        console.log('4')
        highestOffer = listing.offers[0];
        secondHighestOffer = listing.offers[1];
        console.info('highest Offer: ' + highestOffer);
        console.info('second Highest Offer: ' + secondHighestOffer);

        //bid must be higher than reserve price, otherwise we can sell the car
        if (highestOffer.bidPrice >= listing.reservePrice) {
          let buyer = highestOffer.member;
          console.log('5')
          console.info('highestOffer.member: ' + buyer);

          //get the buyer or highest bidder on the item
          let buyerAsBytes = await ctx.stub.getState(buyer);
          if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
            throw new Error('buyer does not exist in network');
          }
          console.log('6')
          buyer = JSON.parse(buyerAsBytes);
          console.info('buyer: ');
          console.info(util.inspect(buyer, { showHidden: false, depth: null }));
          console.log('7')

          //get reference to item
          let itemAsBytes = await ctx.stub.getState(listing.item);
          if (!itemAsBytes || itemAsBytes.toString().length <= 0) {
            throw new Error('item does not exist');
          }
          console.log('8')
          var item = JSON.parse(itemAsBytes);
          //get reference to the seller - or owner of item
          let sellerAsBytes = await ctx.stub.getState(item.owner);
          if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
            throw new Error('Seller does not exist in network');
          }
          console.log('9')
          let seller = JSON.parse(sellerAsBytes);

          console.info('seller: ');
          console.info(util.inspect(seller, { showHidden: false, depth: null }));

          console.info('#### seller balance before: ' + seller.balance);
          console.info('#### buyer balance before: ' + buyer.balance);
          //ensure all strings get converted to ints
          let sellerBalance = parseInt(seller.balance, 10);
          let secondHighOfferBidPrice = parseInt(secondHighestOffer.bidPrice, 10);
          let buyerBalance = parseInt(buyer.balance, 10);
          console.log('10')
          sellerBalance += secondHighOfferBidPrice;
          seller.balance = sellerBalance;
          buyerBalance -= secondHighestOffer.bidPrice;
          buyer.balance = buyerBalance;
          let oldOwner = item.owner;
          item.owner = highestOffer.member;

          console.info('#### seller balance after: ' + seller.balance);
          console.info('#### buyer balance after: ' + buyerBalance);
          console.info('#### item owner before: ' + item.owner);
          console.info('#### item owner after: ' + item.owner);
          console.info('#### buyer balance after: ' + buyerBalance);
          listing.offers = null;
          listing.listingState = 'SOLD';
          console.log('11')
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
        console.log('4')
        highestOffer = listing.offers[0];
        console.info('highest Offer: ' + highestOffer);

        //bid must be higher than reserve price, otherwise we can sell the car
        if (highestOffer.bidPrice >= listing.reservePrice) {
          let buyer = highestOffer.member;
          console.log('5')
          console.info('highestOffer.member: ' + buyer);

          //get the buyer or highest bidder on the item
          let buyerAsBytes = await ctx.stub.getState(buyer);
          if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
            throw new Error('buyer does not exist in network');
          }
          console.log('6')
          buyer = JSON.parse(buyerAsBytes);
          console.info('buyer: ');
          console.info(util.inspect(buyer, { showHidden: false, depth: null }));
          console.log('7')

          //get reference to item
          let itemAsBytes = await ctx.stub.getState(listing.item);
          if (!itemAsBytes || itemAsBytes.toString().length <= 0) {
            throw new Error('item does not exist');
          }
          console.log('8')
          var item = JSON.parse(itemAsBytes);
          //get reference to the seller - or owner of item
          let sellerAsBytes = await ctx.stub.getState(item.owner);
          if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
            throw new Error('Seller does not exist in network');
          }
          console.log('9')
          let seller = JSON.parse(sellerAsBytes);

          console.info('seller: ');
          console.info(util.inspect(seller, { showHidden: false, depth: null }));

          console.info('#### seller balance before: ' + seller.balance);
          console.info('#### buyer balance before: ' + buyer.balance);
          //ensure all strings get converted to ints
          let sellerBalance = parseInt(seller.balance, 10);
          let highOfferBidPrice = parseInt(highestOffer.bidPrice, 10);
          let buyerBalance = parseInt(buyer.balance, 10);
          console.log('10')
          sellerBalance += highOfferBidPrice;
          seller.balance = sellerBalance;
          buyerBalance -= highestOffer.bidPrice;
          buyer.balance = buyerBalance;
          let oldOwner = item.owner;
          item.owner = highestOffer.member;

          console.info('#### seller balance after: ' + seller.balance);
          console.info('#### buyer balance after: ' + buyerBalance);
          console.info('#### item owner before: ' + item.owner);
          console.info('#### item owner after: ' + item.owner);
          console.info('#### buyer balance after: ' + buyerBalance);
          listing.offers = null;
          listing.listingState = 'SOLD';
          console.log('11')
          //update the balance of the buyer
          await ctx.stub.putState(highestOffer.member, Buffer.from(JSON.stringify(buyer)));
          //update the balance of the seller
          await ctx.stub.putState(oldOwner, Buffer.from(JSON.stringify(seller)));
          // update the listing
          await ctx.stub.putState(listingKey, Buffer.from(JSON.stringify(listing)));
        }
      }
      console.info('inspecting item: ');
      console.info(util.inspect(item, { showHidden: false, depth: null }));
      console.log('12')
      if (highestOffer) {
        //update the owner of the item
        await ctx.stub.putState(listing.item, Buffer.from(JSON.stringify(item)));
      } else { throw new Error('offers do not exist: '); }
      console.log('13')
      console.info('============= END : closeBidding ===========');
    }
}

module.exports = FabCar;
