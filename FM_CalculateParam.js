﻿// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");

var {param_target_orders, param_spread_percent} = require("./json_param_input.json")

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const { api_key, secret } = require("./json_config.json")

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var line = "--------------------------------------------------------------------------------";
var line2 = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
var line3 = "________________________________________________________________________________";

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

function contaBinanceGetBalance(){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/balance";
	var data_query_string = "timestamp=" + Date.now();
	var signature = crypto.createHmac('sha256', secret).update(data_query_string).digest('hex');
	return axios.get(`${burl}${end_point}?${data_query_string}&signature=${signature}`, {headers: {"X-MBX-APIKEY": api_key}});
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

function autoWriteParamOutput(content) {
	fs.writeFile("./json_param_output.json", content, (err) => {
		if (err)
			throw err;
		console.log('The file has been saved!');
	});
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

console.log(" ");
console.log(line);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// BALANCE

dados_balance = contaBinanceGetBalance();
dados_balance.then(function(value){

	trade_balance = value.data[0].balance;
	trade_order_usd_price = trade_balance / param_target_orders;
	console.log(value.data[0]);
	console.log(trade_balance);
	console.log(line)
	console.log(trade_order_usd_price)

});

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//