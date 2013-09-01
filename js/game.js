var game = {
	width: 1000,
	height: 650,
	backgroundColor: '#113',
	ground: {
		height: 25,
		color: '#687'
	},
	city: {
		number: 5,
		width: 40,
		height: 25,
		color: '#ada'
	},
	turret: {
		slots: [2, 6],
		radius: 20,
		color: '#daa'
	},
	missile: {
		speed: 150,
		color: '#f44'
	},
	missiles: [],
	explosion:{
		radius: 40,
		speed: 150,
		duration: 300,
		color: '#6aa'
	},
	explosions: [],
	
	init: function(){
		this.numBuildings = this.city.number + this.turret.slots.length;
		this.spacing = this.width / (this.numBuildings+1);
	},

	update: function(delta){
		var removeIndices = [];
		for(var i = 0; i < this.missiles.length; i++){
			var missile = this.missiles[i];
			missile.x += missile.dx * delta / 1000;
			missile.y += missile.dy * delta / 1000;
			if((missile.dy < 0 && missile.y <= missile.endY) ||
				(missile.dy > 0 && missile.y >= missile.endY)){
					removeIndices.push(i);	
			}
		}
		for(var i = 0; i < removeIndices.length; i++){
			var missile = this.missiles[removeIndices[i]];
			this.missiles.splice(removeIndices[i], 1);
			this.explosions.push({
				x: missile.x,
				y: missile.y,
				startX: missile.startX,
				startY: missile.startY,
				radius: 0,
				duration: 0
			});
		}
			
		removeIndices = [];
		for(var i = 0; i < this.explosions.length; i++){
			var explosion = this.explosions[i];
			if(explosion.radius < this.explosion.radius){
				explosion.radius += this.explosion.speed * delta / 1000;
			}else{
				explosion.duration += delta;
				if(explosion.duration > this.explosion.duration){
					removeIndices.push(i);
				}
			}
		}
		for(var i = 0; i < removeIndices.length; i++){
			this.explosions.splice(removeIndices[i], 1);
		}
	},

	render: function(ctx){
		this.renderBackground(ctx);
		this.renderWeapons(ctx);
		this.renderGround(ctx);
		this.renderBuildings(ctx);
	},

	renderBackground: function(ctx){
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(0, 0, this.width, this.height);
	},

	renderGround: function(ctx){
		ctx.fillStyle = this.ground.color;
		ctx.fillRect(0, 0, this.width, this.ground.height);
		ctx.fillRect(0, this.height, this.width, -this.ground.height);
	},
	
	renderBuildings: function(ctx){
		ctx.fillStyle = this.city.color;
		for(var slot = 1; slot <= this.numBuildings; slot++){
			if(this.turret.slots.indexOf(slot) != -1){
				continue;
			}

			x = slot * this.spacing;
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
			var x = this.spacing * slot;
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

	renderWeapons: function(ctx){
		ctx.strokeStyle = this.missile.color;
		for(var i = 0; i < this.missiles.length; i++){
			var missile = this.missiles[i];
			ctx.beginPath();
			ctx.moveTo(missile.startX, missile.startY);
			ctx.lineTo(missile.x, missile.y);
			ctx.stroke();
		}
		ctx.fillStyle = this.explosion.color;
		for(var i = 0; i < this.explosions.length; i++){
			var explosion = this.explosions[i];
			ctx.beginPath();
			ctx.moveTo(explosion.startX, explosion.startY);
			ctx.lineTo(explosion.x, explosion.y);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(explosion.x, explosion.y, explosion.radius, 0, 2*Math.PI);
			ctx.fill()
		}
	},

	fire: function(turret, x, y){
		var slot = this.turret.slots[turret];
		var startX = this.spacing * slot;
		var startY = this.height - this.ground.height;
		
		var angle = Math.atan2(y - startY, x - startX);
		var dy = this.missile.speed * Math.sin(angle);	
		var dx = this.missile.speed * Math.cos(angle);

		this.missiles.push({
			startX: startX,
			startY: startY,
			x: startX,
			y: startY,
			dx: dx,
			dy: dy,
			endY: y
		});
	},

	enemyFire: function(turret, x, y){
		var slotIndex = this.turret.slots.length - turret - 1;
		var slot = this.turret.slots[slotIndex];
		var startX = this.spacing * slot;
		var startY = this.ground.height;
		
		x += 2*(this.width/2 - x);
		y += 2*(this.height/2 - y);

		var angle = Math.atan2(y - startY, x - startX);
		var dy = this.missile.speed * Math.sin(angle);	
		var dx = this.missile.speed * Math.cos(angle);

		this.missiles.push({
			startX: startX,
			startY: startY,
			x: startX,
			y: startY,
			dx: dx,
			dy: dy,
			endY: y
		});
	}
}
game.init();

var $canvas = $('<canvas></canvas')
	.attr('width', game.width)
	.attr('height', game.height)
	.appendTo('body');
var canvas = $canvas.get(0);
var ctx = canvas.getContext('2d');

var socket = io.connect();
socket.on('fire', function(missileData){
	game.enemyFire(missileData.button, missileData.x, missileData.y);
});


function click(button, x, y){
	game.fire(button, x, y);
	socket.emit('fire', {
		button: button,
		x: x,
		y: y
	});
}
$canvas.click(function(event){
	click(0, event.offsetX, event.offsetY);
});
$canvas.on('contextmenu', function(event){
	event.preventDefault();
	click(1, event.offsetX, event.offsetY);
});

var lastTime = null;
function frame(time){
	if(lastTime === null) lastTime = time - 1;
	delta = time - lastTime;
	lastTime = time;
	
	game.update(delta);
	game.render(ctx);

	window.requestAnimationFrame(frame);
}
function run(){
	window.requestAnimationFrame(frame);
}
run();
