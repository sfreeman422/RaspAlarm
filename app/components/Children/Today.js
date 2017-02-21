var React = require('react');

var Today = React.createClass({
	render: function(){
		return(
		<div className="today">
			<div className="col-xs-12 weekday">
				<p id="dayAndLoc">{this.props.day}, {this.props.date} in {this.props.userLoc}</p>
			</div>
		</div>
		)
	}
})

module.exports = Today; 