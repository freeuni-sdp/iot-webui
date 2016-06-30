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
  for (var entry of entries) {
    domElement.append('<td>' + entry + '</td>');
  }
  domElement.append('</tr>');
}

function updateThermometerUI(result) {
  var tempTable = $('tbody#room-thermometer');
  tempTable.empty();
  for (var elem of result) {
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

var bathHumidityRoutes = {
  lastMeasurement: 'http://private-anon-a083cdbb1-iotbathhumiditysensor.apiary-mock.com/webapi/houses/',
  num_measurements: '/num_measurements/'
}

// we display only last four measurements
var numMeasurementsToDisplay = 4;

function updateBathHumidityUI(result) {
  for (var hum of result) {
    insertTableRow(
      $('tbody#bath-humidity-sensor'),
      [hum.humidity, hum.measurement_time]
    );
  }
}

function loadBathHumidityReadings() {
  var finalUrl = bathHumidityRoutes.lastMeasurement +
    currentlySelectedHouse.RowKey._ + bathHumidityRoutes.num_measurements +
    numMeasurementsToDisplay;
  $.ajax({
    type: 'GET',
    url: finalUrl,
    success: updateBathHumidityUI,
    error: logError
  });
}

var soilMoistureRoutes = {
  baseUrl: 'https://private-anon-ccd5374bf-sdp2.apiary-mock.com/house/'
}

function updateSoilMoistureView(result) {
  var soilMoistureTable = $('tbody#soil-moisture-sensor');
  soilMoistureTable.empty();
  var available = result.available ? 'Yes' : 'No';
  insertTableRow(soilMoistureTable, [result.sensorValueMessage, available]);
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
  for (var device of result) {
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
  // add wrapper to make sure houses info loads first
  invokeAfterHousesLoaded(function() {
    setTimeout(loadThermometerReadings, 1000);
    setTimeout(loadBathLightReadings, 1000);
    setTimeout(loadBathHumidityReadings, 1000);
    setTimeout(loadSoilMoistureReadings, 1000);
    setTimeout(loadRouterReadings, 1000);
  })
})
