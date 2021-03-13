// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");

var { param_symbol, param_order_lev, param_margin_type } = require("./json_param_input.json");

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const { api_key, secret } = require("./json_config.json");

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var line = "--------------------------------------------------------------------------------";
var line2 = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
var line3 = "________________________________________________________________________________";

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

function contaSetLeverage(symbol, leverage){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/leverage";
	var data_query_string = `symbol=${symbol}&leverage=${leverage}&timestamp=` + Date.now();
	var signature = crypto.createHmac('sha256', secret).update(data_query_string).digest('hex');
	var axiosConfig = {headers: {"X-MBX-APIKEY": api_key}};
	var postData;
	return axios.post(`${burl}${end_point}?${data_query_string}&signature=${signature}`, postData, axiosConfig);
};

function contaSetMarginType(symbol, margin_type){
	var burl = "https://fapi.binance.com";
	var end_point = "/fapi/v1/marginType";
	var data_query_string = `symbol=${symbol}&marginType=${margin_type}&timestamp=` + Date.now();
	var signature = crypto.createHmac('sha256', secret).update(data_query_string).digest('hex');
	var axiosConfig = {headers: {"X-MBX-APIKEY": api_key}};
	var postData;
	return axios.post(`${burl}${end_point}?${data_query_string}&signature=${signature}`, postData, axiosConfig);
};


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

console.log(" ");
console.log(line);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// 

dados_balance = contaSetLeverage(param_symbol, param_order_lev);
dados_balance.then(function(value){

	console.log(value.data);

});

dados_balance = contaSetMarginType(param_symbol, param_margin_type);
dados_balance.then(function(value){

	console.log(value.data);

});

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//