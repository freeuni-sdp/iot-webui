var routeMap = {
	'/pingstatus': function(){
		clearAllTimeouts();
		$('#content').load('/html/pingstatus.html');
	},
	'/switches' : function(){
		clearAllTimeouts();
		$('#content').load('/html/switches.html');
	},
	'/sensors': function(){
		clearAllTimeouts();
		$('#content').load('/html/sensors.html');
	},
	'/temperature-scheduler': function(){
		clearAllTimeouts();
		$('#content').load('/html/temperature-scheduler.html');
	},
	'/sprinkler-scheduler': function() {
		clearAllTimeouts();
		$('#content').load('/html/sprinkler-scheduler.html');
	}
};

function changeRouteState(route, title){
	if (!(route in routeMap))
		return;
	history.pushState({
		url: route,
		title: title
	}, title, route);
	document.title = title;
	loadRoute(route);
}

function loadRoute(route){
	if (routeMap[route]) {
		routeMap[route]();
	} else {
		routeMap['switches']();
	}
}

function clearAllTimeouts() {
	var id = window.setTimeout(function(){}, 0);
	while (id--) {
		window.clearTimeout(id);
	}
}

function refresh() {
  loadRoute(window.location.pathname);
}

$(document).ready(function() {
	$(document).on('click', 'a', function(event){
		event.preventDefault();
		var route = $(this).attr('href');
		var title = $(this).text();
		changeRouteState(route, title);
	});

	$(window).on('popstate', function(event){
		var state = event.originalEvent.state;
		if (state != null) {
			currentRoute = state.url;
			document.title = state.title;
			loadRoute(state.url);
		} else {
			currentRoute = '/pingstatus'
			document.title = 'pingstatus';
			loadRoute('pingstatus');
		}
	});

	refresh();
});
