var React = require('react');

var Today = React.createClass({
	render: function(){
		return(
			<div className="today">
				{this.props.date}
			</div>
		)
	}
})

module.exports = Today; 