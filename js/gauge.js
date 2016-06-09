function Gauge(data) {
	this.NS = "http://www.w3.org/2000/svg";

	this.defaults = {
		id: 'gauge',
		range: [
			{value: 0},
			{value: 10},
			{value: 20},
			{value: 30},
			{value: 40},
			{value: 50, color: '#f7a30c'},
			{value: 60, color: '#fb0006'}
		],
		angle: 260,
		stroke:    '#636363',
		textColor: '#636363',
		serifInside: false,
		arrowColor: '#1b97f1',
		dotColor: '#e7e7e7',
		arrowAnglePercents: 70,
		dotsInSector: 4,
		disableDotsInSector: false
	}

	for (d in data) {
		this.defaults[d] = data[d];
	}

	if (!this.check()) {
		return;
	}

	this.radius = 175;
	this.indent = 50;
	this.center = this.radius + this.indent;
	this.arrowCircleRadius = 10;

	this.init();
}

Gauge.prototype.check = function() {
	if (!!document.getElementById(this.defaults.id) == false) {
		alert('Node with id "' + this.defaults.id + '" not found');
		return false;
	}

	if (this.defaults.angle < 1) {
		alert('Minimun angle: 1 deg');
		return false;
	} else if (this.defaults.angle > 359) {
		alert('Maximum angle: 359 deg');
		return false;
	}

	if (this.defaults.range.length < 2) {
		alert('Minimun range length: 2');
		return false;
	}

	if (this.defaults.arrowAnglePercents < 0) {
		alert('Minimun arrow angle in percents is 0');
		return false;
	} else if (this.defaults.arrowAnglePercents > 100) {
		alert('Maximum arrow angle in percents is 100');
		return false;
	}

	return true;
}

Gauge.prototype.init = function() {
	var svg = this.initSvg(),
		delta, alpha, beta,
		MX, MY, X, Y,
		mainPath;
		
	this.emptyAngle = this.getEmptyAngle();
	this.segmentInGrad = this.getSegmentInGrad();

	document.getElementById(this.defaults.id).appendChild(svg);

	// console.log(this);

	if (this.defaults.angle <= 180) {
		delta = (180 - this.defaults.angle) / 2;
		alpha = this.defaults.angle + delta;
		beta = alpha - this.defaults.angle;
	} else {
		delta = (360 - this.defaults.angle) /2;
		alpha = -((this.defaults.angle - 180) / 2) - (360 - this.defaults.angle);
		beta = -((this.defaults.angle - 180) / 2);
	}

	// console.log('entered angle: '+this.defaults.angle)
	// console.log('delta: '+delta)
	// console.log('alpha: '+alpha)
	// console.log('beta: '+beta)

	MX = this.getX(alpha);
	MY = this.getY(alpha);
	X = this.getX(beta);
	Y = this.getY(beta);

	mainPath = this.drawPath({
		mx: MX,
		my: MY,
		rx: this.radius,
		ry: this.radius,
		xAxisRotation: 0,
		largeArcFlag: (this.defaults.angle > 180 ? 1 : 0),
		sweepFlag: 1,
		x: X,
		y: Y,
		className: 'gauge_main-path'
	});

	svg.appendChild(mainPath);

	for (var i = 0; i < this.defaults.range.length; i++) {
		var textElement = this.makeText(i, alpha);
		svg.appendChild(textElement);

		var serif = this.makeSerif(i, alpha);
		svg.appendChild(serif);

		if (this.defaults.range[i].color) {
			var segment = this.makeSegment(i, alpha);
			svg.appendChild(segment);
		}

		if (this.defaults.disableDotsInSector === false){
			this.makeDots(i, alpha, svg);
		}
	}

	this.makeArrow(svg);
}

Gauge.prototype.makeDots = function(pos, alpha, svg) {
	if (pos < this.defaults.range.length - 1) {
		var angleForDot = this.segmentInGrad / (this.defaults.dotsInSector + 1),
			indent = (this.defaults.serifInside === false ? 20 : -10)

		for (var i = 0; i < this.defaults.dotsInSector; i++) {
			var beta = alpha - (this.segmentInGrad * pos) - ((i + 1) * angleForDot),
				X = this.getX(beta, indent),
				Y = this.getY(beta, indent),
				dot = this.makeCircle(X, Y, {r: 2, fill: this.defaults.dotColor, className: 'gauge_dot'});

			svg.appendChild(dot);
		}
	}
}

Gauge.prototype.makeSerif = function(pos, alpha) {
	var alpha = alpha - (this.segmentInGrad * pos),
		startIndent = (this.defaults.serifInside === false ? 20 : -10),
		finishIndent = (this.defaults.serifInside === false ? 10 : -20),
		MX = this.getX(alpha, startIndent),
		MY = this.getY(alpha, startIndent),
		X = this.getX(alpha, finishIndent),
		Y = this.getY(alpha, finishIndent),
		line = this.drawLine({
			mx: MX,
			my: MY,
			x: X,
			y: Y,
			className: 'gauge_serif'
		});

	return line;
}

Gauge.prototype.makeArrow = function(svg) {
	var circle = this.makeCircle(this.center, this.center, {className: 'gauge_arrow_circle'}),
		pointer = this.makePointer(this.center, this.center);

	svg.appendChild(circle);
	svg.appendChild(pointer);
}

Gauge.prototype.makePointer = function(x, y) {
	var pointer = document.createElementNS(this.NS, "polyline");

	pointer.setAttribute("points", this.getPointerCords());
	pointer.setAttribute("fill", this.defaults.arrowColor);
	pointer.setAttribute("transform", 'rotate(' + this.getAngleForPointer() + ', ' + this.center + ', ' + this.center + ')');
	pointer.setAttribute("class", 'gauge_arrow_pointer');

	return pointer;
}

Gauge.prototype.getAngleForPointer = function() {
	var relativeAngle = ((this.defaults.angle * this.defaults.arrowAnglePercents) / 100) - (this.defaults.angle / 2);

	return relativeAngle;
}

Gauge.prototype.getPointerCords = function() {
	var p1 = (this.center - this.arrowCircleRadius / 2) + ','  + this.center,
		p2 = (this.center + this.arrowCircleRadius / 2) + ','  + this.center,
		p3 = this.center +',' + ((this.defaults.serifInside === false ? -25 : 15) + this.indent);

	return p1 + ' ' + p2 + ' ' + p3;
}

Gauge.prototype.makeCircle = function(x, y, data) {
	var circle = document.createElementNS(this.NS, "circle"),
		stroke = (data && data.stroke ? data.stroke : this.defaults.arrowColor),
		fill = (data && data.fill ? data.fill : this.defaults.arrowColor),
		r = (data && data.r ? data.r : this.arrowCircleRadius),
		className = (data && data.className ? data.className : '');

	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("stoke", stroke);
	circle.setAttribute("fill", fill);
	circle.setAttribute("r", r);
	circle.setAttribute("class", className);

	return circle;
}

Gauge.prototype.makeSegment = function(pos, alpha) {
	var alphaStart = alpha - (this.segmentInGrad * pos) - (this.segmentInGrad / 2),
		alphaFinish = alphaStart + this.segmentInGrad,
		MX, MY, X, Y,
		path;

	if (pos == 0) {
		alphaFinish = alphaFinish - (this.segmentInGrad / 2);
	} else if (pos == (this.defaults.range.length - 1)) {
		alphaStart = alphaStart + (this.segmentInGrad / 2);
	}

	MX = this.getX(alphaStart);
	MY = this.getY(alphaStart);
	X = this.getX(alphaFinish);
	Y = this.getY(alphaFinish);

	path = this.drawPath({
		mx: MX,
		my: MY,
		rx: this.radius,
		ry: this.radius,
		xAxisRotation: 0,
		largeArcFlag: (Math.abs(alphaStart - alphaFinish)  > 180 ? 1 : 0),
		sweepFlag: 0,
		x: X,
		y: Y,
		stroke: this.defaults.range[pos].color,
		className: 'gauge_path'
	});

	return path;
}

Gauge.prototype.makeText = function(pos, alpha) {
	var alpha = alpha - (this.segmentInGrad * pos),
		startIndent = (this.defaults.serifInside === false ? 30 : -30),
		MX = this.getX(alpha, startIndent),
		MY = this.getY(alpha, startIndent),
		text = this.text({
			x: MX,
			y: MY,
			value: this.defaults.range[pos].value
		});

	return text;
}

Gauge.prototype.getX = function(alpha, delta) {
	var delta = delta || 0;

	return (this.radius + this.indent + ((this.radius + delta) * Math.cos(-1 * alpha * Math.PI/180)));
}

Gauge.prototype.getY = function(alpha, delta) {
	var delta = delta || 0;

	return (this.radius + this.indent + ((this.radius + delta) * Math.sin(-1 * alpha * Math.PI/180)));
}

Gauge.prototype.initSvg = function() {
	var svg = document.createElementNS(this.NS, "svg");

 	svg.setAttribute('width','500px');
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
	path.setAttribute("stroke-width", "2px");
	path.setAttribute("class",  data.className || '');

	return path;
}

Gauge.prototype.text = function(data) {
	var text = document.createElementNS(this.NS, "text");

	text.setAttribute("x", data.x);
	text.setAttribute("y", data.y);
	text.setAttribute("font-family", "sans-serif");
	text.setAttribute("font-size", "15px");
	text.setAttribute("fill", this.defaults.textColor);
	text.setAttribute("class", 'gauge_text');
	text.style.textAnchor = "middle";
	text.innerHTML = data.value;

	return text;
}

Gauge.prototype.getEmptyAngle = function() {
	return 360 - this.defaults.angle;
}

Gauge.prototype.getSegmentInGrad = function() {
	return this.defaults.angle / (this.defaults.range.length - 1);
}

if (typeof jQuery == "undefined") {
	console.log('jQuery undefined');
} else {
	console.log('jQuery defined');

	jQuery.fn.gauge = function(options){
		var options = options || {};

		options.id = this.get(0).id;

		new Gauge(options);

		return this;
	}
}
