var http = require("http");
var fs = require('fs');
var url = require("url");
var path = require('path');

http.createServer(function(request, response) {
	 var pathname = url.parse(request.url).pathname, // /index.html
		 extName;

	if (pathname === "/") pathname = "/index.html";
	extName = path.extname(request.url).replace('.', ''); // html

    if (request.method === 'GET') {
            fs.readFile(request.url.replace('/', ''), function (err, data) {
                 // console.log('data',JSON.parse(data) );
                var types = {
                    'js': 'text/javascript',
                    'css': 'text/css',
                    'html': 'text/html',
                    'json': 'application/json',
                    'ico': 'image/x-icon'
                };
                // console.log('types[extName]',types[extName]);
                response.writeHead(200, {
                    'Content-Type': types[extName]
                });

                response.end(data);
            });

    } //request.method === 'GET'

    if(request.method === 'POST'){
        if (request.url === '/sendForWrite'){
            request.on('data',function (clientData) {
                var newTask = JSON.parse(clientData);
                fs.readFile('task.json', function (err,data) {
                   var tasks = JSON.parse(data);
                   if(tasks.length !== 0){
                       newTask.id = tasks[tasks.length-1].id + 1;
                   }else{
                       newTask.id = 0;
                   }
                    tasks.push(newTask);
                    fs.writeFile('task.json',JSON.stringify(tasks, '', 4),function (err) {
                        if (err){
                            console.log('ERROR is ',err);    
                        }else {
                            response.writeHead(200);  
                            response.end(JSON.stringify(newTask));
                        }
                    });
                });fs.readFile
            });
        } request.url === '/sendForWrite'
    } request.method === 'POST'


    if(request.method === 'POST'){
        if (request.url === '/sendForRemove'){
            request.on('data',function (clientData) {
                var ID = JSON.parse(clientData),
                    temp;

                fs.readFile('task.json', function (err,data) {
                    var tasks = JSON.parse(data);
                    tasks.forEach(function (el, index) {
                        if(el.id == ID) {
                            temp = index;
                        }
                    })
                    tasks.splice(temp,1);
                    console.log('tasks ',tasks);
                    fs.writeFile('task.json',JSON.stringify(tasks, '', 4),function (err) {
                        if (err){
                            console.log('ERROR is ',err);
                        }else {
                            response.writeHead(200);
                            response.end();
                        }
                    });
                });
            });
        }
    }


    if(request.method === 'POST'){
        if (request.url === '/sendForChangingCheck'){
            request.on('data',function (clientData) {
                var ID = JSON.parse(clientData);
                var temp;
                fs.readFile('task.json', function (err,data) {
                    var tasks = JSON.parse(data);
                    tasks.forEach(function (el, index) {
                        if(el.id == ID) {
                            el.checked = !el.checked;
                        }
                    })

                    console.log('tasks ',tasks);
                    fs.writeFile('task.json',JSON.stringify(tasks, '', 4),function (err) {
                        if (err){
                            console.log('ERROR is ',err);
                        }else {
                            response.writeHead(200);
                            response.end();
                        }
                    });
                });
            });
        }
    }

}).listen(8080);

console.log('Server running on port 8080');


