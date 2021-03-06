// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const axios = require("axios");

var { param_symbol } = require("./json_param_input.json");


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var line = "--------------------------------------------------------------------------------";
var line2 = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
var line3 = "________________________________________________________________________________";

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

function contaBinanceGetPublicInfo(symbol){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/depth";
	var data_query_string = `symbol=${symbol}`;
	return axios.get(burl+end_point+"?"+data_query_string);
};


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

console.log(" ");
console.log(line);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// BALANCE

dados_balance = contaBinanceGetPublicInfo(param_symbol);
dados_balance.then(function(value){
	console.log("	COMPRA: " + value.data.bids[0][0]);
	//console.log(value.data.bids[1]);
	console.log("	VENDA: " + value.data.asks[0][0]);
	//console.log(value.data.asks[1]);
});

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//