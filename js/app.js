'use strict';

var BootstrapButton = React.createClass({
	render: function() {
		return (
		  <a {...this.props}
			href="javascript:;"
			role="button"
			className={(this.props.className || '') + ' btn'} />
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
			<div className="jumbotron">
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
		return (
			<div>
				<h3>({this.state.latitude}, {this.state.longitude})</h3>				
			</div>
			);
	}
})
React.render(
	<div>
		<BootstrapNavbar name="Where am I?">
			<BootstrapNavbarItem text="Github" />
		</BootstrapNavbar>
		<BootstrapContainer>
			<BootstrapJumbotron width="12">
				<LocationViewer />
			</BootstrapJumbotron>
		</BootstrapContainer>
	</div>
	
	,
	document.getElementById("whereami")
);

