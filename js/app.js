'use strict';

var BootstrapButton = React.createClass({
	render: function() {
		return (
			<button {...this.props}
				role="button"
				className={(this.props.className || '') + ' btn'}>
					{this.props.children}
			</button>
		);
	}
});

var BootstrapNavbar = React.createClass({
	render: function() {
		return (
			<nav className='navbar navbar-default navbar-fixed-top'>
				<div className='container-fluid'>
					<div className="navbar-header">
						<button className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
							aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#">{this.props.name}</a>
					</div>
					<div id="navbar" className="collapse navbar-collapse">
						<ul className="nav navbar-nav">
							{this.props.children}
						</ul>					
					</div>
				</div>
			</nav>
		);

	}
});

var BootstrapNavbarItem = React.createClass({
	render: function()
	{
		return (
			<li className={(this.props.className || '')}>
				<a href="#" onClick={this.onClick}>{this.props.text}</a>
			</li>
		);
	},
	onClick: function(event)
	{
		if (this.props.clickHandler !== undefined)
			this.props.clickHandler(event);
	}
});

var BootstrapContainer = React.createClass({
	render: function()
	{
		return (
			<div className="container theme-showcase" role="main">
				{this.props.children}
			</div>
		);
	}
});
var BootstrapSwitch = React.createClass({
	componentDidMount: function()
	{
		$("#"+this.props.id).bootstrapSwitch();
		$("#"+this.props.id).on('switchChange.bootstrapSwitch', this.onChange);
	},
	onChange: function()
	{
		if (this.props.onChange != null)
			this.props.onChange();
	},
	render: function()
	{
		return (
			<input type="checkbox" {...this.props} checked/>
		);
	}
});
var BootstrapJumbotron = React.createClass({
	render: function()
	{
		return (
			<div className="jumbotron vertical-align">
				{this.props.children}
			</div>
		);
	}
});
var LocationViewer = React.createClass({
	getInitialState: function()
	{
		if (window.navigator.geolocation.getCurrentPosition == null || window.navigator.geolocation.watchPosition == null)
			return {error: "not supported", units: this.props.units};
		return {error: "initializing", units: this.props.units};
	},
	componentDidMount: function()
	{
		if (window.navigator.geolocation.getCurrentPosition != null && window.navigator.geolocation.watchPosition != null)
			this.watch = window.navigator.geolocation.watchPosition(
				(function(position)
				{
					var distanceCalc = function (lon1, lat1, lon2, lat2, unit) {
						var toRad = function(a) { return a * Math.PI / 180};
						var R = {km: 6371, mi: 3959}; // Radius of the earth 
						var dLat = toRad(lat2-lat1);		// Javascript functions in radians
						var dLon = toRad(lon2-lon1); 
						var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
							Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
							Math.sin(dLon/2) * Math.sin(dLon/2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
						var d = R[unit] * c; // Distance in km
						return d;
					}
					var distance = this.state.error === null || this.state.error.length > 0 || this.state.longitude == undefined || this.state.latitude == undefined ? 0 : 
						distanceCalc(position.coords.longitude, position.coords.latitude, this.state.longitude, this.state.latitude, this.state.units);
					var speed = 1000 * 3600 * this.state.distance / (Date.now() - this.state.time);
					if (isNaN(speed))
					{
						speed = 0;
					}
					this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude, time:Date.now(), distance: distance, speed: speed, error:""});
				}).bind(this)
				,
				(function()
				{
					this.setState({error: "error"});
				}).bind(this),
				{
					enableHighAccuracy: true,
					maximumAge: 30000,
					timeout: 27000
				});
		$("[name='unit-checkbox']").bootstrapSwitch();
	},
	componentWillUnmount: function()
	{
		window.navigator.geolocation.clearWatch(this.watch);
	},
	render: function()
	{		
		var point = new GeoPoint(this.state.longitude, this.state.latitude);
		var unitChanger = (function(){ this.setState({units: this.state.units === "mi" ? "km" : "mi"})}).bind(this);
		return (
			<div>
				<button className="btn btn-lg" type="button" onClick={(function(){window.location.href = "https://www.google.com/maps/place/"+this.state.latitude+"+"+this.state.longitude}).bind(this)}>
					({point.getLatDeg()}, {point.getLonDeg()})
				</button>
				<br />
				<h3>Speed: {this.state.speed} {this.state.units}/hr</h3>			
				<BootstrapSwitch id="unit-changer" onChange={unitChanger} data-on-color="info" data-off-color="warning" data-on-text="miles" data-off-text="km" data-label-text="units"/>
			</div>
			);
	}
});
var ParallaxBackground = React.createClass({
	getInitialState: function()
	{
		return {width: window.innerWidth, height: window.innerHeight};
	},
	handleResize: function(e) {
		var scene = document.getElementById("scene");
		scene.style.width = window.innerWidth + 'px';
		scene.style.height = window.innerHeight + 'px';
		$(".background").height(window.innerHeight*1.3);
		$(".background").width(window.innerWidth*1.3);
	},
	componentDidMount: function() {
		//this.parallax = new Parallax(document.getElementById('scene'))
		//this.parallax.disable();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		setTimeout(function(){ this.parallax = new Parallax(document.getElementById('scene')); }, 5000);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	render: function()
	{
		
		return (
			<div className="absolute-div">
				<ul id="scene" className="scene">				
					<li className="layer" data-depth="0.90">
						<div className="background">
						</div>
					</li>
				</ul>
			</div>
		);
	}
});
$(document).ready(function(){
	React.render(
		<div>
			<BootstrapNavbar name="Where am I?">
				<BootstrapNavbarItem text="Github" clickHandler={function(){ window.location = "https://github.com/souvik1997/whereami";}}/>
			</BootstrapNavbar>		
			<ParallaxBackground />
			<BootstrapContainer>
				<BootstrapJumbotron width="12">
					<LocationViewer units="mi"/>
				</BootstrapJumbotron>
			</BootstrapContainer>
		</div>
		
		,
		document.getElementById("whereami")
	);
});
$(document).bind('touchmove', function(e) {
	e.preventDefault();
});