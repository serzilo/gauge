function Gauge(data) {
	this.NS = "http://www.w3.org/2000/svg";

	this.defaults = {
		id: 'gauge',
		range: [0, 10, 20, 30, 40, 50, 60],
		angle: 275,
		stroke: '#636363',
		textColor: '#636363',
		serifInside: false
	}

	for (d in data){
		this.defaults[d] = data[d];
	}

	this.radius = 175;
	this.indent = 40;
	this.center = this.radius + this.indent;

	this.init();
}

Gauge.prototype.init = function() {
	var svg = this.initSvg();
		
	this.emptyAngle = this.getEmptyAngle();
	this.segmentInGrad = this.getSegmentInGrad();

	var coordinates = this.getCoordinatesForPath();

	/*
	var mainPath = this.drawPath({
			mx: coordinates.mx + this.indent,
			my: coordinates.my + this.indent,
			rx: this.radius,
			ry: this.radius,
			xAxisRotation: 0,
			largeArcFlag: (this.defaults.angle >= 180 ? 1 : 0),
			sweepFlag: 1,
			x: coordinates.x + this.indent,
			y: coordinates.y + this.indent,
			className: 'mainPath'
		});

	svg.appendChild(mainPath);
	*/

	for (var i = 0; i < this.defaults.range.length; i++){

		/*
		var textElement = this.makeText(i);
		svg.appendChild(textElement);

		var serif = this.makeSerif(i);
		svg.appendChild(serif);
		*/
	}

	document.getElementById(this.defaults.id).appendChild(svg);

	console.log(this);

	var alpha, delta, beta;

	if (this.defaults.angle <= 180) {
		delta = (180 - this.defaults.angle) / 2;
		alpha = this.defaults.angle + delta;
		beta = alpha - this.defaults.angle;
		
	} else {
		delta = (360 - this.defaults.angle) /2;
		alpha = this.defaults.angle + delta;
		beta =  alpha + 2 * delta;

		alpha = -((this.defaults.angle -180) / 2) - (360 - this.defaults.angle);
		beta = -((this.defaults.angle -180) / 2);
	}

	console.log('this.defaults.angle: '+this.defaults.angle)
	console.log('delta: '+delta)
	console.log('alpha: '+alpha)
	console.log('beta: '+beta)

	var tempMX = this.getX(alpha),
		tempMY = this.getY(alpha),
		tempX = this.getX(beta),
		tempY = this.getY(beta);

	if (this.defaults.angle <= 180){
		tempMY = 2 * this.radius - tempMY + this.indent + 10;
		tempY = 2 * this.radius - tempY  + this.indent + 10;
	}

	console.log('tempMX: '+tempMX+' tempMY: '+tempMY);
	console.log('tempX: '+tempX+' tempY: '+tempY);

	var mainPath = this.drawPath({
			mx: tempMX,
			my: tempMY,
			rx: this.radius,
			ry: this.radius,
			xAxisRotation: 0,
			largeArcFlag: (this.defaults.angle > 180 ? 1 : 0),
			sweepFlag: 1,
			x: tempX,
			y: tempY,
			className: 'mainPath'
		});

	svg.appendChild(mainPath);

	for (var i = 0; i < this.defaults.range.length; i++){
		var textElement = this.makeText2(i, alpha);
		svg.appendChild(textElement);

		var serif = this.makeSerif2(i, alpha);
		svg.appendChild(serif);
	}
}

Gauge.prototype.makeText2 = function(pos, alpha) {
	var alpha = alpha - (this.segmentInGrad * pos),
		startIndent = (this.defaults.serifInside === false ? 30 : -30);

	var tempMX = this.getX(alpha, startIndent),
		tempMY = this.getY(alpha, startIndent),

		text = this.text({
			x: tempMX,
			y: tempMY,
			value: this.defaults.range[pos]
		});

	return text;
}

Gauge.prototype.makeText = function(pos) {
	var postion = this.textPosition(pos),
		text = this.text({
			x: postion.x,
			y: postion.y,
			value: this.defaults.range[pos]
		});

	return text;
}

Gauge.prototype.makeSerif2 = function(pos, alpha) {
	
	var alpha = alpha - (this.segmentInGrad * pos),
		startIndent = (this.defaults.serifInside === false ? 20 : -10),
		finishIndent = (this.defaults.serifInside === false ? 10 : -20);

	var tempMX = this.getX(alpha, startIndent),
		tempMY = this.getY(alpha, startIndent),
		tempX = this.getX(alpha, finishIndent),
		tempY = this.getY(alpha, finishIndent);

	var line = this.drawLine({
			mx: tempMX,
			my: tempMY,
			x: tempX,
			y: tempY,
			className: 'serif'
		});

	return line;
}

Gauge.prototype.makeSerif = function(pos) {
	var i = (this.segmentInGrad * pos) - this.emptyAngle,
		startIndent = (this.defaults.serifInside === false ? 20 : -10),
		finishIndent = (this.defaults.serifInside === false ? 10 : -20),
		mx = this.getCoordX(i, startIndent) + this.indent,
		my = this.getCoordY(i, startIndent) + this.indent,
		x = this.getCoordX(i, finishIndent) + this.indent,
		y = this.getCoordY(i, finishIndent) + this.indent,
		line = this.drawLine({
			mx: mx,
			my: my,
			x: x,
			y: y,
			className: 'serif'
		});

	return line;
}

Gauge.prototype.getX = function(alpha, delta) {
	var k = (alpha < 0 ? -1 : 1);
	var delta = delta || 0;
	return (this.radius + this.indent + ((this.radius + delta) * Math.cos(k * alpha * Math.PI/180)));
}

Gauge.prototype.getY = function(alpha, delta) {
	var k = (alpha < 0 ? -1 : 1);
	var delta = delta || 0;
	return (this.radius + this.indent + ((this.radius + delta) * Math.sin(k * alpha * Math.PI/180)));
}

Gauge.prototype.initSvg = function() {
	var svg = document.createElementNS(this.NS, "svg");

 	svg.setAttribute('width','1450px');
 	svg.setAttribute('height','450px');

	return svg;
}

Gauge.prototype.drawPath = function(data) {
	var path = document.createElementNS(this.NS, "path"),
		d = "M " + data.mx + "," + data.my + " A" + data.rx + ","  + data.ry + " " + data.xAxisRotation + " " + data.largeArcFlag + ", "  + data.sweepFlag + " "  + data.x + ","  + data.y;

	path.setAttribute("d", d);
	path.setAttribute("stroke", data.stroke || this.defaults.stroke);
	path.setAttribute("stroke-width", "3px");
	path.setAttribute("fill", "none");

	path.setAttribute("class",  data.className || '');

	return path;
}

Gauge.prototype.drawLine = function(data) {
	var path = document.createElementNS(this.NS, "path"),
		d = "M" + data.mx + "," + data.my + " L"  + data.x + ","  + data.y;

	path.setAttribute("d", d);
	path.setAttribute("stroke", data.stroke || this.defaults.stroke);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke-width", "3px");

	path.setAttribute("class",  data.className || '');

	return path;
}



Gauge.prototype.text = function(data) {
	var text = document.createElementNS(this.NS, "text");

	//text.setAttribute("x", data.x + this.indent);
	//text.setAttribute("y", data.y + this.indent);

	text.setAttribute("x", data.x);
	text.setAttribute("y", data.y);
	text.setAttribute("font-family", "sans-serif");
	text.setAttribute("font-size", "15px");
	text.setAttribute("fill", this.defaults.textColor);
	text.setAttribute("class", 'gauge-text');
	text.style.textAnchor = "middle";

	text.innerHTML = data.value;

	return text;
}

Gauge.prototype.textPosition = function(pos) {
	var i = (this.segmentInGrad * pos) - this.emptyAngle,
		startIndent = (this.defaults.serifInside === false ? 30 : -30),
		x = this.getCoordX(i, startIndent),
		y = this.getCoordY(i, startIndent);

	return {x: x, y: y};
}

Gauge.prototype.getEmptyAngle = function() {
	return 360 - this.defaults.angle;
}


Gauge.prototype.getGradusFromCosinus = function(val) {
	var rad = Math.acos(val),
		grad = rad * 180 / Math.PI;

	return grad;
}

Gauge.prototype.getSegmentInGrad = function() {
	return this.defaults.angle / (this.defaults.range.length - 1);
}

Gauge.prototype.getCoordinatesForPath = function() {
	var mx = this.getCoordX(-this.emptyAngle),
		my = this.getCoordY(-this.emptyAngle),
		x = this.getCoordX(this.defaults.angle-this.emptyAngle),
		y = this.getCoordY(this.defaults.angle-this.emptyAngle);

	return {mx: mx, my: my, x: x, y: y};
}

Gauge.prototype.getCoordX = function(i, delta) {
	var delta = delta || 0;

	return (this.radius + ((this.radius + delta) * Math.cos((i-90) / 180 * Math.PI)));
}

Gauge.prototype.getCoordY = function(i, delta) {
	var delta = delta || 0;

	return (this.radius + ((this.radius + delta) * Math.sin((i-90) / 180 * Math.PI)));
}



