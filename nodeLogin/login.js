'use strict';

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var results = []
	if (username && password) {
		//connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (username == password) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/addMem');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		//});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// For addMemToState

// app.use(bodyParser.urlencoded({extended : true}));
// app.use(bodyParser.json());addMemState

app.get('/addMem', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/addMemState.html'));
	} else {
		response.send('Please login to view this page!');
	}
});
app.post('/added', function(request, response){
	var FirstName = request.body.firstname;
	var LastName = request.body.lastname;
	var Amount = request.body.amount;
	var user = request.session.username;


	if (request.session.loggedin) {
		async function AddMem() {
		    try {

		        // Create a new file system based wallet for managing identities.
		        const walletPath = path.join(process.cwd(), 'wallet');
		        const wallet = new FileSystemWallet(walletPath);
		        console.log(`Wallet path: ${walletPath}`);

		        // Check to see if we've already enrolled the user.
		        const userExists = await wallet.exists(user);
		        if (!userExists) {
		            response.send('An identity for the user ${user} does not exist in the wallet');
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
		        await contract.submitTransaction('addMemToState', FirstName, LastName, Amount, user);
		        response.send('Added member.');

		        // Disconnect from the gateway.
		        await gateway.disconnect();

		    } catch (error) {
		        response.send(`Failed to submit transaction: ${error}`);
		        process.exit(1);
		    }
		}
		AddMem();

		//response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

// DISPLAY OPTIONS TO THE USER

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});


// ACCEPT Listing

app.get('/createListing', function(request, response){
	response.sendFile(path.join(__dirname + '/createListing.html'))
})

app.post('/listing', function(request, response) {
	var description = request.body.description;
	var reservePrice = request.body.reservePrice;
	var user = request.session.username;

	if (request.session.loggedin) {
		// CODE HERE
		response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});

// MAKE OFFER

app.get('/makeoffer', function(request, response){
	response.sendFile(path.join(__dirname + '/makeOffer.html'))
})

app.post('/offer', function(request, response) {
	var bidPrice = request.body.bid;
	var listingId = request.body.listingId;
	var user = request.session.username;

	if (request.session.loggedin) {
		// CODE HERE
		response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});

// QUERY MEMBER

app.get('/querymem', function(request, response){
	response.sendFile(path.join(__dirname + '/queryMem.html'))
})

app.post('/queryM', function(request, response) {
	var memName = request.body.querym;


	if (request.session.loggedin) {
		// CODE HERE
		response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});

// QUERY LOT

app.get('/querylot', function(request, response){
	response.sendFile(path.join(__dirname + '/queryLot.html'))
})

app.post('/queryL', function(request, response) {
	var lotName = request.body.queryL;


	if (request.session.loggedin) {
		// CODE HERE
		response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});


// QUERY ALL

app.get('/queryall', function(request, response){
	response.sendFile(path.join(__dirname + '/queryAll.html'))
})

app.post('/queryA', function(request, response) {
	// No input

	if (request.session.loggedin) {
		// CODE HERE
		response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});


// CLOSE BID

app.get('/closeBidding', function(request, response){
	response.sendFile(path.join(__dirname + '/closeBid.html'))
})

app.post('/close', function(request, response) {
	var listingId = request.body.listingId;
	var user = request.session.username;

	if (request.session.loggedin) {
		// CODE HERE
		response.redirect('/options');
	} else {
		response.send('Please login to view this page!');
	}

	response.end();
});

app.get('/options', function(request, response) {
	response.sendFile(path.join(__dirname + '/options.html'));
});
app.listen(3000);
