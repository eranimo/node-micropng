var fs = require('fs'),
    PNG = require('pngjs').PNG,
    http = require('http');

function decToHex (number){
    return '0x'+(number).toString(16);
}


/*  MicroPNG : Number width, Number height
    creates a new png image of a defined size

    Examples:

    var png = new MicroPNG(200,200);
    png.background([255,255,255]);
    png.point(1, 1, [100, 200, 100]);
    png.rect(0, 0, 200, 200, [200, 40, 40]);
    png.rect(4, 4, 80, 80, [70, 70, 70], true, [200,200,200]);
    
    // Exports PNG file:
    png.exportFile(__dirname + '/bg.png');

    // Exports to server
    png.exportServer(8084);
*/
var MicroPNG = function (width, height){
    this.png = new PNG({
        width: width,
        height: height,
        filterType: -1
    });
};

/*  MicroPNG.point : Number x, Number y, Array color
    paints an x,y pixel a particular color
*/
MicroPNG.prototype.point = function (x, y, color){
    var idx = (this.png.width * y + x) << 2;
    this.png.data[idx]   = decToHex(color[0]);
    this.png.data[idx+1] = decToHex(color[1]);
    this.png.data[idx+2] = decToHex(color[2]);
    this.png.data[idx+3] = 0xff;
};

/*  MicroPNG.background : Array color
    covers entire png in a particular color
*/
MicroPNG.prototype.background = function (color) {
    var x, y, idx;
    for (y = 0; y < this.png.height; y++) {
        for (x = 0; x < this.png.width; x++) {
            this.point(x, y, color);
        }
    }
};

/*  MicroPNG.rect : Number x1, Number y1, Number x2, Number y2, Array color, Boolean fill, Array fillColor
    Draws a rectangle from x1,y1 to x2,y2 with a particular color
    If fill is true and fillColor is empty, the rectangle will be filled with 'color'
    If fill is true and fillColor is defined, the rectangle will be filled with 'fillColor'
    otherwise the rectangle will not be filled
*/
MicroPNG.prototype.rect = function (x1, y1, x2, y2, color, fill, fillColor) {
    var x, y;
    for (x = x1; x < x2; x++){
        this.point(x, y1, color);
        this.point(x, y2-1, color);
    }
    for (y = y1; y < y2; y++){
        this.point(x1, y, color);
        this.point(x2-1, y, color);
    }
    if(fill){
        if(typeof fillColor === 'undefined'){
            fillColor = color;
        }
        for (y = x1+1; y < x2-1; y++) {
            for (x = y1+1; x < y2-1; x++) {
                this.point(x, y, fillColor);
            }
        }
    }

};
/*  MicroPNG.exportFile : String path
    exports the png image to a file
*/
MicroPNG.prototype.exportFile = function (path) {
    var out = fs.createWriteStream(path);
    this.png.pack().pipe(out);
    out.on('error', function(err){
        console.log(err);
    });
};
/*  MicroPNG.exportServer : Number port
    sends the png image through http on a particular port
    used for testing purposes
*/
MicroPNG.prototype.exportServer = function (port) {
    var self = this;
    http.createServer(function(req, res){
        res.writeHead(200, {'Content-Type': 'image/png' });
        var stream = self.png.pack();
        stream.on('data', function(chunk) {
            res.write(chunk);
        });
        stream.on('end', function() {
            res.end();
        });
    }).listen(port);
};
module.exports = MicroPNG;