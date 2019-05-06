#!/bin/bash
node enrollAdmin.js
node registerUser.js ayush.nath
node registerUser.js vineet.n
node registerUser.js deva.m
node init.js
node addMem.js ayush.nath Ayush Nath 10000
node addMem.js vineet.n Vineet Nandkishore 10000
node addMem.js deva.m Deva Madala 10000
node createListing.js ayush.nath civic 1000
node makeOffer.js vineet.n LOT1 1200
node makeOffer.js deva.m LOT1 1500
node makeOffer.js vineet.n LOT1 400
node makeOffer.js deva.m LOT1 1500
node closeBidding.js ayush.nath LOT1
