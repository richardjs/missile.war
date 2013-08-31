var game = {
	width: 1000,
	height: 650,
	ground: {
		height: 25,
		color: '#687',
	},
	city: {
		number: 5,
		width: 40,
		height: 25,
		color: '#ada',
	},
	turret: {
		slots: [2, 6],
		radius: 20,
		color: '#daa',
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
		var numBuildings = this.city.number + this.turret.slots.length;
		var spacing = this.width / (numBuildings+1);
		
		ctx.fillStyle = this.city.color;
		for(var slot = 1; slot <= numBuildings; slot++){
			if(this.turret.slots.indexOf(slot) != -1){
				continue;
			}

			x = slot * spacing;
			var cityLeft = x - this.city.width/2;
			var cityTop = this.ground.height;
			ctx.fillRect(cityLeft, cityTop,
				this.city.width, this.city.height);
			cityTop = this.height - this.ground.height;
			ctx.fillRect(cityLeft, cityTop,
				this.city.width, -this.city.height);
		}

		ctx.fillStyle = this.turret.color;
		for(var i = 0; i < this.turret.slots.length; i++){
			var slot = this.turret.slots[i];
			var x = spacing * slot;
			var y = this.ground.height;
			ctx.beginPath();
			ctx.arc(x, y, this.turret.radius, Math.PI, 2*Math.PI, true);
			ctx.fill();
			y = this.height - this.ground.height;
			ctx.beginPath();
			ctx.arc(x, y, this.turret.radius, Math.PI, 2*Math.PI);
			ctx.fill();
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
