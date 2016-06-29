var express = require('express')
var path = require('path')
var app = express()

// set directory for serving static content
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/html/index.html')
})

// if deployed to heroku, port will be set from env variable,
// while running locally, port will be 8080
app.listen(process.env.PORT || 8444)