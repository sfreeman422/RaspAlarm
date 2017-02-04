var React = require('react');

var Weather = React.createClass({
	render: function(){
		return(
			<div className="col-xs-12 allWeather">
				<div className="col-xs-2 weatherToday">
					<p>{this.props.today}</p>
					<p>{this.props.todayHour}</p>
				</div>
				<div className="col-xs-2 weatherOne">
					<p>{this.props.one}</p>
					<p>{this.props.oneHour}</p>
				</div>
				<div className="col-xs-2 weatherTwo">
					<p>{this.props.two}</p>
					<p>{this.props.twoHour}</p>
				</div>
				<div className="col-xs-2 weatherThree">
					<p>{this.props.three}</p>
					<p>{this.props.threeHour}</p>
				</div>
				<div className="col-xs-2 weatherFour">
					<p>{this.props.four}</p>
					<p>{this.props.fourHour}</p>
				</div>
				<div className="col-xs-2 weatherFive">
					<p>{this.props.five}</p>
					<p>{this.props.fiveHour}</p>
				</div>
			</div>
		)
	}
})

module.exports = Weather; 