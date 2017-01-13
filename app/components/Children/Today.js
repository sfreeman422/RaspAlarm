var React = require('react');

var Today = React.createClass({
	render: function(){
		return(
			<div className="col-xs-12 today">
				{this.props.date}
			</div>
		)
	}
})

module.exports = Today; 