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

## 5. Interact with Application

```bash
node bidder.js
```
## 6. Open server at http://localhost:3000

## 6.1 Results will be visible in terminal

## 6.2. There are some developer functions in query.js

```bash
node query.js [userId]
```

## To stop the app

```bash
cd ../../basic-network
./reset.sh
```
