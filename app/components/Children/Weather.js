var React = require('react');

var Weather = React.createClass({
	render: function(){
		return(
			<div className="col-xs-12 allWeather">
				<div className="col-xs-2 weatherToday">
					<img src={this.props.todayPic}></img>
					<p>{this.props.today}</p>
					<p>{this.props.todayHour}</p>
				</div>
				<div className="col-xs-2 weatherOne">
					<img src={this.props.onePic}></img>
					<p>{this.props.one}</p>
					<p>{this.props.oneHour}</p>
				</div>
				<div className="col-xs-2 weatherTwo">
					<img src={this.props.twoPic}></img>
					<p>{this.props.two}</p>
					<p>{this.props.twoHour}</p>
				</div>
				<div className="col-xs-2 weatherThree">
					<img src={this.props.threePic}></img>
					<p>{this.props.three}</p>
					<p>{this.props.threeHour}</p>
				</div>
				<div className="col-xs-2 weatherFour">
					<img src={this.props.fourPic}></img>
					<p>{this.props.four}</p>
					<p>{this.props.fourHour}</p>
				</div>
				<div className="col-xs-2 weatherFive">
					<img src={this.props.fivePic}></img>
					<p>{this.props.five}</p>
					<p>{this.props.fiveHour}</p>
				</div>
			</div>
		)
	}
})

module.exports = Weather; 