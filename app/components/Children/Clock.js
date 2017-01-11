var React = require('react');

var Clock = React.createClass({
	render: function(){
		return(
		<div className = "clock">
			<h1 className="time">{this.props.time}</h1>
		</div>
	)}
});

module.exports = Clock; 