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
			<nav className='navbar navbar-default navbar-static-top'>
				<div className='container'>
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
					<div id="navbar" className="navbar-collapse collapse">
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
			return {latitude: 0, longitude: 0, error: "not supported"};
		return {latitude: 0, longitude: 0, error: "initializing"};
	},
	componentDidMount: function()
	{
		if (window.navigator.geolocation.getCurrentPosition != null && window.navigator.geolocation.watchPosition != null)
			this.watch = window.navigator.geolocation.watchPosition(
				(function(position)
				{
					this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
				}).bind(this)
				,
				(function()
				{
					this.setState({latitude: 0, longitude: 0, error: "error"});
				}).bind(this),
				{
					enableHighAccuracy: true,
					maximumAge: 30000,
					timeout: 27000
				});
	},
	componentWillUnmount: function()
	{
		window.navigator.geolocation.clearWatch(this.watch);
	},
	render: function()
	{
		var point = new GeoPoint(this.state.longitude, this.state.latitude);
		return (
			<div>
				<button className="btn btn-lg" type="button" onClick={(function(){window.location.href = "https://www.google.com/maps/place/"+this.state.latitude+"+"+this.state.longitude}).bind(this)}>
					({point.getLatDeg()}, {point.getLonDeg()})
				</button>
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
		this.setState({windowWidth: window.innerWidth});
	},
	componentDidMount: function() {
		var scene = document.getElementById("scene");
		scene.style.width = window.innerWidth + 'px';
		scene.style.height = window.innerHeight + 'px';
		$(".background").height(window.innerHeight*1.3);
		$(".background").width(window.innerWidth*1.3);
		var scene = document.getElementById('scene');
		var parallax = new Parallax(scene);
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	render: function()
	{
		
		return (
			<div className="absolute-div">
				<ul id="scene" className="scene unselectable">				
					<li className="layer" data-depth="0.30">
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
				<BootstrapNavbarItem text="Github" />
			</BootstrapNavbar>		
			<ParallaxBackground />
			<BootstrapContainer>
				<BootstrapJumbotron width="12">
					<LocationViewer />
				</BootstrapJumbotron>
			</BootstrapContainer>
		</div>
		
		,
		document.getElementById("whereami")
	);
});
