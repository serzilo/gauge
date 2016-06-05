function Gauge(data) {
	this.NS = "http://www.w3.org/2000/svg";

	this.defaults = {
		id: 'gauge',
		range: [0, 10, 20, 30, 40, 50, 60],
		angle: 240,
		stroke: '#636363',
		textColor: '#636363',
		serifInside: false
	}

	for (d in data){
		this.defaults[d] = data[d];
	}

	console.log(this.defaults);

	this.radius = 175;
	this.indent = 30;
	this.center = this.radius + this.indent;

	this.init();
}

Gauge.prototype.init = function() {
	var svg = this.initSvg();
		
	this.emptyAngle = this.getEmptyAngle();
	this.segmentInGrad = this.getSegmentInGrad();

	var coordinates = this.getCoordinatesForPath(),
		mainPath = this.drawPath({
			mx: coordinates.mx + this.indent,
			my: coordinates.my + this.indent,
			rx: this.radius,
			ry: this.radius,
			xAxisRotation: 0,
			largeArcFlag: 1,
			sweepFlag: 1,
			x: coordinates.x + this.indent,
			y: coordinates.y + this.indent,
			className: 'mainPath'
		});

	svg.appendChild(mainPath);

	for (var i = 0; i < this.defaults.range.length; i++){
		var textElement = this.makeText(i);

		svg.appendChild(textElement);

		var serif = this.makeSerif(i);
		svg.appendChild(serif);
	}

	document.getElementById(this.defaults.id).appendChild(svg);
}

Gauge.prototype.initSvg = function() {
	var svg = document.createElementNS(this.NS, "svg");

 	svg.setAttribute('width','400px');
 	svg.setAttribute('height','400px');

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

Gauge.prototype.makeSerif = function(pos) {
	var i = (this.segmentInGrad * pos) - this.emptyAngle,
		x = this.getCoordX(i) + this.indent,
		y = this.getCoordY(i) + this.indent,
		line = this.drawLine({
			mx: x,
			my: y,
			x: x + 10,
			y: y + 10,
			className: 'serif'
		});

	return line;
}

Gauge.prototype.text = function(data) {
	var text = document.createElementNS(this.NS, "text");

	text.setAttribute("x", data.x + this.indent);
	text.setAttribute("y", data.y + this.indent);
	text.setAttribute("font-family", "sans-serif");
	text.setAttribute("font-size", "15px");
	text.setAttribute("fill", this.defaults.textColor);
	text.setAttribute("class", 'gauge-text');

	text.innerHTML = data.value;

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

Gauge.prototype.textPosition = function(pos) {
	var i = (this.segmentInGrad * pos) - this.emptyAngle,
		x = this.getCoordX(i, 10),
		y = this.getCoordY(i, 10);

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
	return this.defaults.angle / this.defaults.range.length;
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



