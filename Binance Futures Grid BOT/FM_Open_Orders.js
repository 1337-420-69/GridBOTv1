// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// LIB

const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// JSON

var { param_symbol, param_order_amount, param_target_orders, param_spread_percent } = require("./json_param_input.json");
const { api_key, secret } = require("./json_config.json");

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// INTERFACE

var line = "--------------------------------------------------------------------------------";
var line2 = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
var line3 = "________________________________________________________________________________";

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// BINANCE FUNCTIONS

function contaBinanceGetPublicInfo(symbol){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/depth";
	var data_query_string = `symbol=${symbol}`;
	return axios.get(burl+end_point+"?"+data_query_string);
};

function contaBinancePostOrder(symbol, side, type, time_in_force, quantity, price){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/order";
	var data_query_string = `symbol=${symbol}&side=${side}&type=${type}&timeInForce=${time_in_force}&quantity=${quantity}&price=${price}&recvWindow=5000&timestamp=` + Date.now();
	var signature = crypto.createHmac('sha256', secret).update(data_query_string).digest('hex');
	var axiosConfig = {headers: {"X-MBX-APIKEY": api_key}};
	var postData;
	return axios.post(`${burl}${end_point}?${data_query_string}&signature=${signature}`, postData, axiosConfig);
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// BOT FUNCTIONS

function autoBuyOrder(price){
	return contaBinancePostOrder(param_symbol, "BUY", "LIMIT", "GTC", Number(param_order_amount), price);
};

function autoSellOrder(price){
	return contaBinancePostOrder(param_symbol, "SELL", "LIMIT", "GTC", Number(param_order_amount), price);
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

console.log(" ");
console.log(line);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// GET MARKET PRICE

market_data = contaBinanceGetPublicInfo(param_symbol);
market_data.then(function(value){

	var valor_compra = Number(value.data.bids[0][0]);
	var valor_venda = Number(value.data.asks[0][0]);
	var valor_temp1 = (valor_compra + valor_venda) * 50;
	var base_price = Math.round(valor_temp1) / 100;

	console.log("	COMPRA: " + valor_compra);
	console.log("	VENDA: " + valor_venda);
	console.log(base_price);

	var base_buy_price = base_price;
	var base_sell_price = base_price;

	var order_loop;
	for (order_loop = 0; order_loop < param_target_orders; order_loop++) {

		// OPEN BUY ORDERS

		var new_price = base_buy_price * (1.00 - (Number(param_spread_percent) / 100));
		var valor_temp1 = new_price * 100;
		var new_price_round = Math.round(valor_temp1) / 100;

		base_buy_price = new_price_round;
		
		order_data = autoBuyOrder(new_price_round);
		order_data.then(function(value){

			console.log(`	Order Price: ${value.data.OrderId}`);
			console.log(`	Order Price: ${value.data.price}`);
	
		});

		// OPEN SELL ORDERS

		var new_price = base_sell_price * (1.00 + (Number(param_spread_percent) / 100));
		var valor_temp1 = new_price * 100;
		var new_price_round = Math.round(valor_temp1) / 100;

		base_sell_price = new_price_round;
		
		order_data = autoSellOrder(new_price_round);
		order_data.then(function(value){

			console.log(`	Order Price: ${value.data.OrderId}`);
			console.log(`	Order Price: ${value.data.price}`);

		});

	};


});


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//