function Gauge(t){this.NS="http://www.w3.org/2000/svg",this.defaults={id:"gauge",range:[{value:0},{value:10},{value:20},{value:30},{value:40},{value:50,color:"#f7a30c"},{value:60,color:"#fb0006"}],angle:260,stroke:"#636363",textColor:"#636363",serifInside:!1,arrowColor:"#1b97f1",dotColor:"#e7e7e7",arrowAnglePercents:70,dotsInSector:4,disableDotsInSector:!1};for(d in t)this.defaults[d]=t[d];this.check()&&(this.radius=175,this.indent=50,this.center=this.radius+this.indent,this.arrowCircleRadius=10,this.init())}Gauge.prototype.check=function(){return 0==!!document.getElementById(this.defaults.id)?(alert('Node with id "'+this.defaults.id+'" not found'),!1):this.defaults.angle<1?(alert("Minimun angle: 1 deg"),!1):this.defaults.angle>359?(alert("Maximum angle: 359 deg"),!1):this.defaults.range.length<2?(alert("Minimun range length: 2"),!1):this.defaults.arrowAnglePercents<0?(alert("Minimun arrow angle in percents is 0"),!1):!(this.defaults.arrowAnglePercents>100)||(alert("Maximum arrow angle in percents is 100"),!1)},Gauge.prototype.init=function(){var t,e,s,i,r,a,n,u,l=this.initSvg();this.emptyAngle=this.getEmptyAngle(),this.segmentInGrad=this.getSegmentInGrad(),document.getElementById(this.defaults.id).appendChild(l),this.defaults.angle<=180?(t=(180-this.defaults.angle)/2,e=this.defaults.angle+t,s=e-this.defaults.angle):(t=(360-this.defaults.angle)/2,e=-((this.defaults.angle-180)/2)-(360-this.defaults.angle),s=-((this.defaults.angle-180)/2)),i=this.getX(e),r=this.getY(e),a=this.getX(s),n=this.getY(s),u=this.drawPath({mx:i,my:r,rx:this.radius,ry:this.radius,xAxisRotation:0,largeArcFlag:this.defaults.angle>180?1:0,sweepFlag:1,x:a,y:n,className:"gauge_main-path"}),l.appendChild(u);for(var o=0;o<this.defaults.range.length;o++){var h=this.makeText(o,e);l.appendChild(h);var d=this.makeSerif(o,e);if(l.appendChild(d),this.defaults.range[o].color){var g=this.makeSegment(o,e);l.appendChild(g)}this.defaults.disableDotsInSector===!1&&this.makeDots(o,e,l)}this.makeArrow(l)},Gauge.prototype.makeDots=function(t,e,s){if(t<this.defaults.range.length-1)for(var i=this.segmentInGrad/(this.defaults.dotsInSector+1),r=this.defaults.serifInside===!1?20:-10,a=0;a<this.defaults.dotsInSector;a++){var n=e-this.segmentInGrad*t-(a+1)*i,u=this.getX(n,r),l=this.getY(n,r),o=this.makeCircle(u,l,{r:2,fill:this.defaults.dotColor,className:"gauge_dot"});s.appendChild(o)}},Gauge.prototype.makeSerif=function(t,e){var e=e-this.segmentInGrad*t,s=this.defaults.serifInside===!1?20:-10,i=this.defaults.serifInside===!1?10:-20,r=this.getX(e,s),a=this.getY(e,s),n=this.getX(e,i),u=this.getY(e,i),l=this.drawLine({mx:r,my:a,x:n,y:u,className:"gauge_serif"});return l},Gauge.prototype.makeArrow=function(t){var e=this.makeCircle(this.center,this.center,{className:"gauge_arrow_circle"}),s=this.makePointer(this.center,this.center);t.appendChild(e),t.appendChild(s)},Gauge.prototype.makePointer=function(t,e){var s=document.createElementNS(this.NS,"polyline");return s.setAttribute("points",this.getPointerCords()),s.setAttribute("fill",this.defaults.arrowColor),s.setAttribute("transform","rotate("+this.getAngleForPointer()+", "+this.center+", "+this.center+")"),s.setAttribute("class","gauge_arrow_pointer"),s},Gauge.prototype.getAngleForPointer=function(){var t=this.defaults.angle*this.defaults.arrowAnglePercents/100-this.defaults.angle/2;return t},Gauge.prototype.getPointerCords=function(){var t=this.center-this.arrowCircleRadius/2+","+this.center,e=this.center+this.arrowCircleRadius/2+","+this.center,s=this.center+","+((this.defaults.serifInside===!1?-25:15)+this.indent);return t+" "+e+" "+s},Gauge.prototype.makeCircle=function(t,e,s){var i=document.createElementNS(this.NS,"circle"),r=s&&s.stroke?s.stroke:this.defaults.arrowColor,a=s&&s.fill?s.fill:this.defaults.arrowColor,n=s&&s.r?s.r:this.arrowCircleRadius,u=s&&s.className?s.className:"";return i.setAttribute("cx",t),i.setAttribute("cy",e),i.setAttribute("stoke",r),i.setAttribute("fill",a),i.setAttribute("r",n),i.setAttribute("class",u),i},Gauge.prototype.makeSegment=function(t,e){var s,i,r,a,n,u=e-this.segmentInGrad*t-this.segmentInGrad/2,l=u+this.segmentInGrad;return 0==t?l-=this.segmentInGrad/2:t==this.defaults.range.length-1&&(u+=this.segmentInGrad/2),s=this.getX(u),i=this.getY(u),r=this.getX(l),a=this.getY(l),n=this.drawPath({mx:s,my:i,rx:this.radius,ry:this.radius,xAxisRotation:0,largeArcFlag:Math.abs(u-l)>180?1:0,sweepFlag:0,x:r,y:a,stroke:this.defaults.range[t].color,className:"gauge_path"})},Gauge.prototype.makeText=function(t,e){var e=e-this.segmentInGrad*t,s=this.defaults.serifInside===!1?30:-30,i=this.getX(e,s),r=this.getY(e,s),a=this.text({x:i,y:r,value:this.defaults.range[t].value});return a},Gauge.prototype.getX=function(t,e){var e=e||0;return this.radius+this.indent+(this.radius+e)*Math.cos(-1*t*Math.PI/180)},Gauge.prototype.getY=function(t,e){var e=e||0;return this.radius+this.indent+(this.radius+e)*Math.sin(-1*t*Math.PI/180)},Gauge.prototype.initSvg=function(){var t=document.createElementNS(this.NS,"svg");return t.setAttribute("width","500px"),t.setAttribute("height","450px"),t},Gauge.prototype.drawPath=function(t){var e=document.createElementNS(this.NS,"path"),s="M "+t.mx+","+t.my+" A"+t.rx+","+t.ry+" "+t.xAxisRotation+" "+t.largeArcFlag+", "+t.sweepFlag+" "+t.x+","+t.y;return e.setAttribute("d",s),e.setAttribute("stroke",t.stroke||this.defaults.stroke),e.setAttribute("stroke-width","3px"),e.setAttribute("fill","none"),e.setAttribute("class",t.className||""),e},Gauge.prototype.drawLine=function(t){var e=document.createElementNS(this.NS,"path"),s="M"+t.mx+","+t.my+" L"+t.x+","+t.y;return e.setAttribute("d",s),e.setAttribute("stroke",t.stroke||this.defaults.stroke),e.setAttribute("fill","none"),e.setAttribute("stroke-width","2px"),e.setAttribute("class",t.className||""),e},Gauge.prototype.text=function(t){var e=document.createElementNS(this.NS,"text");return e.setAttribute("x",t.x),e.setAttribute("y",t.y),e.setAttribute("font-family","sans-serif"),e.setAttribute("font-size","15px"),e.setAttribute("fill",this.defaults.textColor),e.setAttribute("class","gauge_text"),e.style.textAnchor="middle",e.innerHTML=t.value,e},Gauge.prototype.getEmptyAngle=function(){return 360-this.defaults.angle},Gauge.prototype.getSegmentInGrad=function(){return this.defaults.angle/(this.defaults.range.length-1)},"undefined"==typeof jQuery?console.log("jQuery undefined"):(console.log("jQuery defined"),jQuery.fn.gauge=function(t){var t=t||{};return t.id=this.get(0).id,new Gauge(t),this});