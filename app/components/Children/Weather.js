var React = require('react');

var Weather = React.createClass({
	render: function(){
		return(
			<div className="allWeather">
				<div className="weatherToday">
					{this.props.today}
				</div>
				<div className="weatherOne">
					{this.props.one}
				</div>
				<div className="weatherTwo">
					{this.props.two}
				</div>
				<div className="weatherThree">
					{this.props.three}
				</div>
				<div className="weatherFour">
					{this.props.four}
				</div>
				<div className="weatherFive">
					{this.props.five}
				</div>
			</div>
		)
	}
})

module.exports = Weather; 