var React = require('react');

var Weather = React.createClass({
	render: function(){
		return(
			<div className="allWeather">
				<div className="weatherToday">
					{this.props.weatherToday}
				</div>
				<div className="weatherOne">
					{this.props.weatherOne}
				</div>
				<div className="weatherTwo">
					{this.props.weatherTwo}
				</div>
				<div className="weatherThree">
					{this.props.weatherThree}
				</div>
				<div className="weatherFour">
					{this.props.weatherFour}
				</div>
				<div className="weatherFive">
					{this.props.weatherFive}
				</div>
			</div>
		)
	}
})

module.exports = Weather; 