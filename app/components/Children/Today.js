import React from 'react'

export default class Today extends React.Component{
	render(){
		return(
		<div className="today">
			<div className="col-xs-12 weekday">
				<p id="dayAndLoc">{this.props.day}, {this.props.date} in {this.props.userLoc}</p>
			</div>
		</div>
		)
	}
}