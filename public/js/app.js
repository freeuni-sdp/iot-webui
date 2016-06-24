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
			document.title = state.title;
			load(state.url);
		} else {
			document.title = 'pingstatus';
			load('pingstatus');
		}
	});

	function changeRouteState(route, title){
		history.pushState({
			url: route, 
			title: title
		}, title, route);
		document.title = title;
		load(route);
	}

	function load(route){
		var routeMap = {
			'/pingstatus': function(){
				$('#content').load('/html/pingstatus.html');
			},
			'/switches' : function(){
				$('#content').load('/html/switches.html');
			}
		};
		routeMap[route]();
	}

	// redirect default to pingstatus
	changeRouteState('/pingstatus', 'pingstatus');
});
