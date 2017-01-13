var React = require('react');

var Weather = React.createClass({
	render: function(){
		return(
			<div className="col-xs-12 allWeather">
				<div className="col-xs-2 weatherToday">
					<p>{this.props.today}</p>
				</div>
				<div className="col-xs-2 weatherOne">
					<p>{this.props.one}</p>
				</div>
				<div className="col-xs-2 weatherTwo">
					<p>{this.props.two}</p>
				</div>
				<div className="col-xs-2 weatherThree">
					<p>{this.props.three}</p>
				</div>
				<div className="col-xs-2 weatherFour">
					<p>{this.props.four}</p>
				</div>
				<div className="col-xs-2 weatherFive">
					<p>{this.props.five}</p>
				</div>
			</div>
		)
	}
})

module.exports = Weather; 