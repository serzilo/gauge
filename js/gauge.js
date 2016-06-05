function Gauge(data) {
	this.NS = "http://www.w3.org/2000/svg";

	this.defaults = {
		id: 'gauge',
		range: [0, 10, 20, 30, 40, 50, 60],
		stroke: '#636363',
		textColor: '#636363'
	}

	for (d in data){
		this.defaults[d] = data[d];
	}

	console.log(this.defaults);

	this.init();
}

Gauge.prototype.init = function() {
	var svg = this.initSvg(),
		mainPath = this.drawPath({
			mx: 50,
			my: 310,
			rx: 175,
			ry: 175,
			xAxisRotation: 0,
			largeArcFlag: 1,
			sweepFlag: 1,
			x: 350,
			y: 310,
			className: 'mainPath'
		});

	svg.appendChild(mainPath);

	this.emptyAngle = this.getEmptyAngle();
	this.segmentInGrad = this.getSegmentInGrad();

	for (var i = 0; i < this.defaults.range.length; i++){
		var textElement = this.makeText(i);

		svg.appendChild(textElement);
	}

	document.getElementById(this.defaults.id).appendChild(svg);
}

Gauge.prototype.initSvg = function() {
	var svg = document.createElementNS(this.NS, "svg");

 	svg.setAttribute('width','400px');
 	svg.setAttribute('height','345px');

	return svg;
}

Gauge.prototype.drawPath = function(data) {
	// var path = '<path d="M 70,70 A75,55   45              0, 1 160,140" />';
	var path = document.createElementNS(this.NS, "path"),
		d = "M " + data.mx + "," + data.my + " A" + data.rx + ","  + data.ry + " " + data.xAxisRotation + " " + data.largeArcFlag + ", "  + data.sweepFlag + " "  + data.x + ","  + data.y;

	path.setAttribute("d", d);
	path.setAttribute("stroke", data.stroke || this.defaults.stroke);
	path.setAttribute("stroke-width", "3px");
	path.setAttribute("fill", "none");

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
	var L = 350 - 50;
	var h = 175 - Math.sqrt((Math.pow(175,2)) - (Math.pow(L,2) /4));

	// console.log(h);

	var cos = Math.cos(this.segmentInGrad * pos);
	console.log('cos :' + cos);

	var sin = Math.sin(this.segmentInGrad * pos);
	console.log('sin: ' + sin);



	var i = (this.segmentInGrad * pos) - this.emptyAngle;

	var x = (175 + (185 * Math.cos((i-90) / 180 * Math.PI))) +5;
	var y = (175 + (185 * Math.sin((i-90) / 180 * Math.PI))) + 45;


	return {x: x + 15, y: y};
}

Gauge.prototype.getEmptyAngle = function() {
	var L = 350 - 50,
		emptyAnleCos = (Math.pow(175,2) + Math.pow(175,2) - Math.pow(L,2)) / (2 * 175 * 175),
		grad = this.getGradusFromCosinus(emptyAnleCos);

	console.log(grad);

	return grad;
}


Gauge.prototype.getGradusFromCosinus = function(val) {
	var rad = Math.acos(val),
		grad = rad * 180 / Math.PI;

	return grad;
}

Gauge.prototype.getSegmentInGrad = function(val) {
	var grad = (360 - this.emptyAngle) / this.defaults.range.length;

	console.log(grad);

	return grad;
}

