var React = require('react');

var Clock = React.createClass({
	render: function(){
		return(
		<div className = "col-xs-12 clock">
			<h1 className="time">{this.props.time}</h1>
		</div>
	)}
});

module.exports = Clock; 