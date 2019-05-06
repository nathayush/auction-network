[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# Running the app through the terminal

## 1. Start the fabric nodes and install the chaincode

```bash
cd fabcar
./startFabric.sh javascript
cd javascript
```

## To run a simulation

```bash
./simulation.sh
```

## 2. Enroll the admin

```bash
node enrollAdmin.js
```

## 3. Admin registers the users

```bash
node registerUser.js [userId]
```

## 4. Admin initializes the ledger

```bash
node init.js
```

## 5. User adds themselves to the ledger

```bash
node addMem.js [userId] [firstName] [lastName] [balance]
```

## 6.1. User can now invoke further commands

```bash
node createListing.js [userId] [oneWordDescription] [reservePrice]
node makeOffer.js [userId] [lotId] [bidPrice]
node closeBidding.js [userId] [lotId]
```

## 6.2. There are some developer functions in query.js

```bash
node query.js [userId]
```

## To stop the app

```bash
cd ../../basic-network
./reset.sh
```
