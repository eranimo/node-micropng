node-micropng
=============

A tiny pixel manipulation helper for node.js using [pngjs](https://github.com/niegowski/node-pngjs). It also includes the option to write a png image directly to a server for quick testing and prototyping.

##Installation
```
npm install micropng
```

##API documentation
###constructor
```javascript
var MicroPNG = require('micropng');
var png = new MicroPNG(200, 200);	// new png of width and height 200
```

###point
Paints a pixel a particular color
```javascript
png.point(5, 5, [50,50,50]);	// at (5, 5) make a point with RGB value of 50,50,50
```

###background
Fills entire image with a color
```javascript
png.background([255,255,255]);
```

###rect
```javascript
png.rect(0, 0, 200, 200, [200, 40, 40]);	// unfilled red rectangle from (0,0) to (200,200)
png.rect(0, 0, 200, 200, [70, 70, 70], true);		// filled grey rectangle
png.rect(0, 0, 200, 200, [70, 70, 70], true, [200,0,0]);	// grey rectangle with red fill
```

###exportFile
Exports the image to a file
```javascript
png.exportFile(__dirname + '/image.png');
```

###exportServer
Runs a local server on a given port serving the image
```javascript
png.exportServer(8084);
```