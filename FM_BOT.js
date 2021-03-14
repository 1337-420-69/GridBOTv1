// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");

var { param_symbol, param_spread_percent, param_order_amount } = require("./json_param_input.json")
const { api_key, secret } = require("./json_config.json")

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var line = "--------------------------------------------------------------------------------";
var line2 = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
var line3 = "________________________________________________________________________________";

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// BINANCE FUNCTIONS

function contaBinanceCheckUserTrades(symbol, limit){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/userTrades";
	var data_query_string = `symbol=${symbol}&limit=${limit}&timestamp=` + Date.now();
	var signature = crypto.createHmac('sha256', secret).update(data_query_string).digest('hex');
	return axios.get(`${burl}${end_point}?${data_query_string}&signature=${signature}`, {headers: {"X-MBX-APIKEY": api_key}});
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

function autoReadOrdersList(){
	return fs.readFileSync("txt_order_list.txt").toString();
};

function autoWriteOrdersList(content) {
	fs.writeFile("./txt_order_list.txt", content, (err) => {
		if (err)
			throw err;
		console.log('The file has been saved!');
	});
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

console.log(" ");
console.log(line);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// GET MARKET PRICE

market_data = contaBinanceCheckUserTrades(param_symbol, 20);
market_data.then(function(value){

	read_list = autoReadOrdersList();
	old_list = read_list.split(",");

	//console.log(old_list);
	var order_id_list = [];

	value.data.forEach(function(d_value, d_index, d_array) {

		order_id_list.push(d_value.orderId);

		if(old_list.toString().includes(d_value.orderId)){

			//console.log("NOTHING TO DO");
			
		}else{

			console.log(d_value);
			console.log("REDO ORDER");

			if(d_value.side == "BUY"){

				console.log("SELLING");

				var new_price = d_value.price * (1.00 + (Number(param_spread_percent) / 100));
				var valor_temp1 = new_price * 100;
				var new_price_round = Math.round(valor_temp1) / 100;
				autoSellOrder(new_price_round);

			}else if(d_value.side == "SELL"){

				console.log("BUYING");

				var new_price = d_value.price * (1.00 - (Number(param_spread_percent) / 100));
				var valor_temp1 = new_price * 100;
				var new_price_round = Math.round(valor_temp1) / 100;
				autoBuyOrder(new_price_round);

			};

		};

	});

	//console.log(order_id_list);
	autoWriteOrdersList(order_id_list);

});

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//