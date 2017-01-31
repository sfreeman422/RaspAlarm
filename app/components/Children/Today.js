var React = require('react');

var Today = React.createClass({
	render: function(){
		return(
		<div className="today">
			<div className="col-xs-12 weekday">
				{this.props.day}
			</div>
			<div className="col-xs-12 date">
			{this.props.date}
			</div>
		</div>
		)
	}
})

module.exports = Today; 