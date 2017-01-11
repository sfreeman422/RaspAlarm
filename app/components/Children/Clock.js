var React = require('react');

var Clock = React.createClass({
	getInitialState: function(){
		return{
			time: undefined
		}
	},
	render: function(){
		return(
		<div className = "clock">
			<h1 className="time">{this.state.time}</h1>
		</div>
	)}
});

module.exports = Clock; 