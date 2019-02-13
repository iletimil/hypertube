const url = require('url');
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

// accessing valuefrom form, saves it in url variable
function testValue(form){
    var testVar = form.searchText.value;
    console.log(testVar);
}

function getParameters() {
    var query = window.location.href.split('?')[1];
   
    //query won't be set if ? isn't in the URL
    if(!query) {
      return { };
    }
   
    var params = query.split('&');
   
    var pairs = {};
    for(var i = 0, len = params.length; i < len; i++) {
      var pair = params[i].split('=');
      pairs[pair[0]] = pair[1];
    }
   
    return pairs;
  }