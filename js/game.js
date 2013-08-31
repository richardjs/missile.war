FIELD_WIDTH = 500;
FIELD_HEIGHT = 500;

var $canvas = $('<canvas></canvas')
	.attr('width', FIELD_WIDTH)
	.attr('height', FIELD_HEIGHT)
	.appendTo('body');
var canvas = $canvas.get(0);
var ctx = canvas.getContext('2d');

$canvas.click(function(event){
	console.log(event.offsetX);
});

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
