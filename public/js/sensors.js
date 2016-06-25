var thermometerRoutes = {
  baseUrl: 'https://private-anon-3dbf9186a-iotroomthermometer.apiary-mock.com/webapi/houses/',
  floorsSufix: '/floors/'
};

function logError(xhr,textStatus,err) {
  console.log("readyState: " + xhr.readyState);
  console.log("responseText: "+ xhr.responseText);
  console.log("status: " + xhr.status);
  console.log("text status: " + textStatus);
  console.log("error: " + err);
}

function insertTableRow(domElement, entries) {
  domElement.append('<tr>');
  for (let entry of entries) {
    domElement.append('<td>' + entry + '</td>');
  }
  domElement.append('</tr>');
}

function updateThermometerUI(result) {
  var tempTable = $('tbody#room-thermometer');
  tempTable.empty();
  for (let elem of result) {
    insertTableRow(tempTable, [elem.floor_id, elem.temperature]);
  }
}

function loadThermometerReadings() {
  var finalUrl = thermometerRoutes.baseUrl + currentlySelectedHouse.RowKey._ +
    thermometerRoutes.floorsSufix;
  $.ajax({
    type: 'GET',
    url: finalUrl,
    success: updateThermometerUI,
    error: logError
  })
}

var bathLightRoutes = {
  baseUrl: 'http://private-anon-e7aca08b3-bathlightsensor.apiary-mock.com/webapi/status/house/'
}

function updateBathLightUI(result) {
  var bathLightTable = $('tbody#bath-light-sensor');
  bathLightTable.empty();
  insertTableRow(bathLightTable, [result.status ? 'On': 'Off', result.time]);
}

function loadBathLightReadings() {
  // mock doesn't work on real house id, it has to be string house_id
  var finalUrl = bathLightRoutes.baseUrl + currentlySelectedHouse.RowKey._;
  $.ajax({
    type: 'GET',
    url: finalUrl,
    success: updateBathLightUI,
    error: logError
  });
}

var soilMoistureRoutes = {
  baseUrl: 'https://private-anon-ccd5374bf-sdp2.apiary-mock.com/house/'
}

function updateSoilMoistureView(result) {
  var soilMoistureTable = $('tbody#soil-moisture-sensor');
  soilMoistureTable.empty();
  for (let value of result.values) {
    var available = value.available ? 'Yes' : 'No';
    insertTableRow(soilMoistureTable, [value.sensorId, value.sensorValue,
      available]);
  }
}

function loadSoilMoistureReadings() {
  var finalUrl = soilMoistureRoutes.baseUrl + currentlySelectedHouse.RowKey._;
  $.ajax({
    type: 'GET',
    url: finalUrl,
    success: updateSoilMoistureView,
    error: logError
  })
}

var routerApiRoutes = {
  baseUrl: 'https://private-anon-b7cd7340c-iotrouter.apiary-mock.com/webapi/houses/',
  deviceListSufix: '/addresses',
  ownerAtHomeSufix: '/available'
}

function updateDevicesUI(result) {
  var devicesTable = $('tbody#mac-addresses');
  devicesTable.empty();
  for (let device of result) {
    console.log(device);
    insertTableRow(devicesTable, [device.deviceName, device.deviceMacAddress]);
  }
}

function updateOwnerAtHome(result) {
  var ownerAtHomeDom = $('a#owner-at-home');
  ownerAtHomeDom.html(result.atHome ? 'Yes' : 'No');
}

function loadRouterReadings() {
  var devicesUrl = routerApiRoutes.baseUrl + currentlySelectedHouse.RowKey._ +
    routerApiRoutes.deviceListSufix;
  var homeOwnerUrl = routerApiRoutes.baseUrl + currentlySelectedHouse.RowKey._ +
    routerApiRoutes.ownerAtHomeSufix;
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: devicesUrl,
    success: updateDevicesUI,
    error: logError
  });
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: homeOwnerUrl,
    success: updateOwnerAtHome,
    error: logError
  });
}

$(document).ready(function() {
  setTimeout(loadThermometerReadings, 1000);
  setTimeout(loadBathLightReadings, 1000);
  setTimeout(loadSoilMoistureReadings, 1000);
  setTimeout(loadRouterReadings, 1000);
})
