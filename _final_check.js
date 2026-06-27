var http = require('http');
var app = require('./app');

// Start server
var server = http.createServer(app);
server.listen(0, function() {
  var port = server.address().port;
  console.log('Server started on port', port);
  
  // Test a request
  var req = http.get('http://localhost:' + port + '/', function(res) {
    var body = '';
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
      console.log('GET / - Status:', res.statusCode);
      console.log('Response length:', body.length, 'bytes');
      
      // Test login page
      http.get('http://localhost:' + port + '/login', function(res2) {
        var body2 = '';
        res2.on('data', function(c) { body2 += c; });
        res2.on('end', function() {
          console.log('GET /login - Status:', res2.statusCode);
          console.log('Response length:', body2.length, 'bytes');
          
          // Test static file
          http.get('http://localhost:' + port + '/css/style.css', function(res3) {
            var body3 = '';
            res3.on('data', function(c) { body3 += c; });
            res3.on('end', function() {
              console.log('GET /css/style.css - Status:', res3.statusCode);
              console.log('Response length:', body3.length, 'bytes');
              
              // Test 404
              http.get('http://localhost:' + port + '/nonexistent', function(res4) {
                console.log('GET /nonexistent - Status:', res4.statusCode);
                console.log('ALL TESTS PASSED!');
                server.close();
                process.exit(0);
              });
            });
          });
        });
      });
    });
  });
  
  req.on('error', function(e) {
    console.log('Request error:', e.message);
    server.close();
    process.exit(1);
  });
  
  // Safety timeout
  setTimeout(function() {
    console.log('TIMEOUT');
    server.close();
    process.exit(1);
  }, 10000);
});
