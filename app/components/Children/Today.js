var React = require('react');

var Today = React.createClass({
	render: function(){
		return(
		<div className="today">
			<div className="col-xs-12 weekday">
				<p>{this.props.day}, {this.props.date}</p>
			</div>
			<div className="col-xs-12 locale">
				<p>{this.props.userLoc}</p>
			</div>
		</div>
		)
	}
})

module.exports = Today; 