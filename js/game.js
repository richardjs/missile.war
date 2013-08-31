var game = {
	width: 1000,
	height: 650,
	groundDepth: 25,
	city: {
		width: 40,
		height: 25,
		color: '#ada',
	},
	ground: {
		height: 25,
		color: '#687',
	},

	backgroundColor: '#113',
	
	render: function(ctx){
		this.renderBackground(ctx);
		this.renderBuildings(ctx);
	},

	renderBackground: function(ctx){
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.fillStyle = this.ground.color;
		ctx.fillRect(0, 0, this.width, this.ground.height);
		ctx.fillRect(0, this.height, this.width, -this.ground.height);
	},
	
	renderBuildings: function(ctx){
		var spacing = this.width / 8;
		ctx.fillStyle = this.city.color;
		for(var x = spacing; x < this.width; x += spacing){
			var cityLeft = x - this.city.width/2;
			var cityTop = this.ground.height;
			ctx.fillRect(cityLeft, cityTop,
				this.city.width, this.city.height)
			var cityTop = this.height - this.ground.height;
			ctx.fillRect(cityLeft, cityTop,
				this.city.width, -this.city.height)
		}
	},
}

var $canvas = $('<canvas></canvas')
	.attr('width', game.width)
	.attr('height', game.height)
	.appendTo('body');
var canvas = $canvas.get(0);
var ctx = canvas.getContext('2d');

$canvas.click(function(event){
	console.log(event.offsetX);
});

game.render(ctx);
