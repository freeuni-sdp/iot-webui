var sprinklerSchedulerApiRoutes = {
  getScheduleStart: 'https://private-anon-1655d467b-sprinklerscheduler.apiary-mock.com/houses/',
  getSchedyleEnd: '/schedule'
};

function updateSprinklerSchedulerUI(result) {
  $('#update').removeAttr('disabled');
  $('#start-month').val(result.startMonth);
  $('#end-month').val(result.endMonth);
  $('#after-sunrise').val(result.afterSunRise);
  $('#before-sunset').val(result.beforeSunSet);

  var excludedList = $('#excluded-list');
  excludedList.find('*').not('.disabled').remove();
  for (var date of result.excluded) {
    finalValue = [date.day, date.month, date.year].join('/');
    excludedList.append('<a class="list-group-item">' + finalValue + '</a>');
  }

  updateSchedule();
}

function loadSprinklerSchedulerReadings() {
  console.log('loading');
  var finalUrl = sprinklerSchedulerApiRoutes.getScheduleStart +
    currentlySelectedHouse.RowKey._ + sprinklerSchedulerApiRoutes.getSchedyleEnd;
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: finalUrl,
    success: updateSprinklerSchedulerUI
  });
}

function deleteFromExclutions() {
  console.log('delete');
  $('#excluded-list .active').remove();
}

function addToExclutions() {
  var inputReading = $('input#new-day-input').val();
  if (!inputReading)
    return;
  // to get the format we need
  inputReading = inputReading.
    split('-').
    reverse().
    map(x => parseInt(x).toString()).
    join('/');
  $('#excluded-list').append('<a class="list-group-item">' + inputReading + '</a>');
}

function updateSchedule() {
  scheduledata = {
    startMonth: $('#start-month').val(),
    endMonth: $('#end-month').val(),
    afterSunRise: $('#after-sunrise').val(),
    beforeSunSet: $('#before-sunset').val(),
    excluded: $('#excluded-list .list-group-item').not('.disabled').
      map(function() {
        return $(this).text();
      }).
      get()
  };
  var finalUrl = sprinklerSchedulerApiRoutes.getScheduleStart +
    currentlySelectedHouse.RowKey._ + sprinklerSchedulerApiRoutes.getSchedyleEnd;
  $.ajax({
    type: 'POST',
    url: finalUrl,
    dataType: 'json',
    data: JSON.stringify(scheduledata),
    contenType: 'application/json',
    statusCode: {
      200: function() {
        console.log('mmmkay');
        alert('Sprinkler Schedule info loaded');
      },
      404: function() {
        console.log('not mmmkay');
        alert('couldnt find sprinkler scheduler resource for given house');
      }
    }
  });
}

$(document).ready(function() {
  $('#update').click(function () {
    updateSchedule();
  })
  $('#btn-add').click(function () {
    addToExclutions();
  });
  $('#btn-delete').click(function () {
    deleteFromExclutions();
  });
  $(document).on('click', '.dynamic-list .list-group-item', function () {
    if ($(this).hasClass('disabled'))
      return;
    $(this).parent().find('.active').removeClass('active');
    $(this).addClass('active');
  });

  invokeAfterHousesLoaded(loadSprinklerSchedulerReadings);
});
