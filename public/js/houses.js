var housesApiRoutes = {
  getAllHouses: 'https://iot-house-registry.herokuapp.com/houses'
}

var currentlySelectedHouse = undefined;
var housesList = undefined;
var observers = []

function registerObserver(fun) {
  observers.push(fun);
}

function initHousesDropdown(result) {
  housesList = result
  var dropdownList = $('.dropdown-menu');
  for (var i in housesList) {
    if (i == 0) {
      currentlySelectedHouse = housesList[i];
      for (let observer of observers) {
        observer();
      }
      observers = [];
      dropdownList.append('<div class="dropdown-item" id="selected">' + housesList[i].name._ + '</div>');
    } else {
      dropdownList.append('<div class="dropdown-item">' + housesList[i].name._ + '</div>');
    }
  }

  $('.dropdown .dropdown-item').click(function(){
    $('.dropdown-item#selected').removeAttr('id');
    $(this).attr('id', 'selected');
    currentlySelectedHouse = housesList[$(this).index()];
    refresh();
  });
}

function refresh() {
  load(window.location.pathname);
}

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: housesApiRoutes.getAllHouses,
    dataType: 'json',
    success: function(result) {
      initHousesDropdown(result);
    }
  });
})
