	const express = require('express')
	const app = express()
	const port = 3000

	const ACCESS_ID = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"; // your access id
	const SECRET_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"; // your secret key

	/**
	 *  Default
	 */

	function createDictText(params) {
	  var keys = Object.keys(params).sort();
	  var qs = keys[0] + "=" + params[keys[0]];
	  for (var i = 1; i < keys.length; i++) {
		qs += "&" + keys[i] + "=" + params[keys[i]];
	  }
	  return qs;
	}

	const crypto = require("crypto");
	function createAuthorization(params) {
	  var text = createDictText(params) + "&secret_key=" + SECRET_KEY;
	  return crypto
		.createHash("md5")
		.update(text)
		.digest("hex")
		.toUpperCase();
	}

	const Axios = require("axios");
	const axios = Axios.create({
	  baseURL: "https://api.coinex.com/v1",
	  headers: {
		"User-Agent":
		  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
		post: {
		  "Content-Type": "application/json",
		},
	  },
	  timeout: 10000,
	});

	/**
	 *  Program
	 */

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.post('/', function(request, response){
		var price = parseFloat(request.body.user.price);
		var decimal = request.body.user.decimal;
		var loopingtimes = request.body.user.loopingtimes;
		var market = request.body.user.market;
		var amount = request.body.user.amount;
		var type = request.body.user.type;
		var x = parseFloat(price); 
		var n = loopingtimes;
		range(x,n);
		
		function range(x, n) {
			var ans = [];
			for (let i = x; i <= n; i++) {
				if (decimal == 0) {
					ans.push(price+i);
				} else if (decimal == 1) {
					ans.push(price+(i/10));
				} else if (decimal == 2) {
					ans.push(price+(i/100));
				} else if (decimal == 3) {
					ans.push(price+(i/1000));
				} else if (decimal == 4) {
					ans.push(price+(i/10000));
				} else if (decimal == 5) {
					ans.push(price+(i/100000));
				} else if (decimal == 6) {
					ans.push(price+(i/1000000));
				}
			}
				
			for(let val of ans) {
				placeLimitOrder(val, market, amount, type);
			
				async function placeLimitOrder(val, market, amount, type) {
				  const data = {
					access_id: ACCESS_ID,
					tonce: Date.now(),
					account_id: 0,
					market: market,
					type: type,
					amount: amount,
					price: val,
				  };
				  const res = await axios.post("/order/limit", data, {
					headers: {
					  authorization: createAuthorization(data),
					},
				  });
				console.log("place limit order:\n", JSON.stringify(res.data, null, 2));
				}
			}
		}

	});

	app.listen(port, () => {
	  console.log(`listening at http://localhost:${port}`)
	})