

function doGet(e) {
  
  return HtmlService.createTemplateFromFile("Index").evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


var ss = SpreadsheetApp.getActive(); // ss = spread sheet
var ws_users = ss.getSheetByName("Users"); // ws = work sheet
var ws_fundings = ss.getSheetByName("Fundings"); 
var ws_data = ss.getSheetByName("Data");
var ws_log = ss.getSheetByName("Log");

function addUser(uname) {

  Logger.log(uname)
  ws_users.appendRow([uname]);
}

 function readUserData() {
    var range = ws_users.getRange(2, 1, getLastPopulatedRow(ws_users)-1, 1).getValues();
    Logger.log(range);
    return range;
}

function readFundingData() {
    var range = ws_fundings.getRange(1, 1, getLastPopulatedRow(ws_fundings), 1).getValues();
    Logger.log(range);
    return range;
}

function loadItemData() {
  var range = ws_data.getRange(2, 1, getLastPopulatedRow(ws_data)-1, 9).getValues();
  //Logger.log(range);
  return range;
}


function borrowItem(id, uname){
  //var id = "3";
  //var uname = "test";
  var column = 1; //column Index   
  var columnValues = ws_data.getRange(2, column, ws_data.getLastRow()).getValues(); //1st is header row
  var searchResult = columnValues.findIndex(id); //Row Index - 2
  Logger.log(searchResult + 2);
  if(searchResult != -1)
    {
        //searchResult + 2 is row index.
        var dt = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd'-'HH:mm");
        ws_data.getRange(searchResult + 2, 7, 1, 3).setValues([["borrowed", uname, dt]]);
        var item_name = ws_data.getRange(searchResult + 2, 2, 1, 1).getValues()[0];
        addLog(id, item_name, uname, "borrow", dt);
    }
}

function returnItem(id, uname){
  //var id = "3";
  //var uname = "test";
  var column = 1; //column Index   
  var columnValues = ws_data.getRange(2, column, ws_data.getLastRow()).getValues(); //1st is header row
  var searchResult = columnValues.findIndex(id); //Row Index - 2
  Logger.log(searchResult + 2);
  if(searchResult != -1)
    {
        //searchResult + 2 is row index.
      var dt = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd'-'HH:mm");
      ws_data.getRange(searchResult + 2, 7, 1, 3).setValues([["available", uname, dt]]);
      var item_name = ws_data.getRange(searchResult + 2, 2, 1, 1).getValues()[0];
      Logger.log(item_name);
      addLog(id, item_name, uname, "return", dt);
    }
}

function addLog(id, item_name, uname, action, dt){
  var log_data = [[id, item_name, uname, action, dt]];
  Logger.log(log_data);
  ws_log.getRange(getLastPopulatedRow(ws_log)+1, 1, 1, 5).setValues(log_data);
}

function addItem(item_name, funding, location, purchaser){
  //var item_name = "New Item";
  //var funding = "amada";
  //var location = "217";
  //var purchaser = "person";
  var last_id = ws_data.getRange(getLastPopulatedRow(ws_data), 1, 1, 1).getValues()[0];
  var item_data = [[Number(last_id)+1, item_name, 1, location, purchaser, funding, "available"]];
  ws_data.getRange(getLastPopulatedRow(ws_data)+1, 1, 1, 7).setValues(item_data);
  
  Logger.log(last_id);
}

Array.prototype.findIndex = function(search){
  if(search == "") return false;
  for (var i=0; i<this.length; i++)
    if (this[i] == search) return i;

  return -1;
} 

function getLastPopulatedRow(sheet) {
  var data = sheet.getDataRange().getValues();
  for (var i = data.length-1; i > 0; i--) {
    for (var j = 0; j < data[0].length; j++) {
      if (data[i][j]) return i+1;
    }
  }
  return 1; // or 1 depending on your needs
}






