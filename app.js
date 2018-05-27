d = console.log;
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express();
const maintenance = false;
const port = process.env.port || 3000;

// Handlebars template engine
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname+'/views/partials');

hbs.registerHelper( 'getCurrentYear', () => new Date().getFullYear() );
hbs.registerHelper( 'scream', (str) => str.toUpperCase() ); 

// Create a server log
app.use( (req,res,next) =>{
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`; 

    d(log)

    fs.appendFile( 'server.log', log+'\n' );
    next();
})

// Maintanence mode
app.use( (req,res,next) => {
    if( req.url.startsWith('/css') ) return next();
    if( maintenance ) {
        res.statusCode = 503;
        res.render( 'maintenance.hbs', {
            title : 'Maintenance Mode',
            message : 'Site is currently under maintanence!',
            backSoon : 'We will be back shortly!'
        } );
        return;
    }
    next();
})

// Server static content
app.use( express.static('/home/scuba/me/dist') );  

/*
app.get( '/', (req,res) => {
    res.render( 'index.hbs', {
        pageTitle : 'Home',
        welcomeMessage : 'Welcome to my page',
        currentYear : 2018
    } );
})

app.get( '/about', (req,res) => {
    res.render( 'about.hbs', {
        pageTitle : 'About',
        currentYear : 2018
    } );
})
*/

app.listen(port, () => {
    console.log( `Server running on port ${port}`);
}); 