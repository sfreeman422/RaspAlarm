import React from 'react'
import { Link } from 'react-router'

export default class CurrentAlarms extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			listAlarms: []
		}
		this._getAlarms = this._getAlarms.bind(this);
		this._removeAlarm = this._removeAlarm.bind(this);
		this._displayLetterForDayOfWeek = this._displayLetterForDayOfWeek.bind(this);
	}
	componentWillReceiveProps(nextProps){
		if(this.props.alarms != nextProps.alarms){
			this.setState({listAlarms: nextProps.alarms});
		}
	}
	_getAlarms(){
		$.ajax({
			url: "/alarms",
			type: "get"
		}).done((alarms)=>{
			this.setState({
				listAlarms: alarms
			});
		});
	}
	_removeAlarm(id){
		$.ajax({
			url: "/deleteAlarm",
			type: "DELETE",
			data: {
				id: id,
				_method: "delete"
			}
		}).done((alarms)=>{
			this._getAlarms();
		});
	}
	_displayLetterForDayOfWeek(days){
		const dayOfWeek = {
			"Monday": "M",
			"Tuesday": "T",
			"Wednesday": "W",
			"Thursday": "Th",
			"Friday": "F",
			"Saturday": "Sat",
			"Sunday": "Sun"
		}
		let responseString = '';
		for(let i = 0 ; i< days.length; i++){
			if(i<days.length-1){
				responseString += dayOfWeek[days[i]]+" | "
			}
			else{
				responseString += dayOfWeek[days[i]]
			}
		}
		return responseString;
	}
	render(){
		if(this.state.listAlarms != undefined){
			return(
			<div className="col-xs-12" id="alarms">
				{this.state.listAlarms.map((alarm, i)=>{
					return (
						<div className="col-xs-2" id="alarm" key={i}>
							<h3 id="alarmTime">{alarm.time}</h3>
							<p id="alarmDay">{this._displayLetterForDayOfWeek(alarm.dayOfWeek)}</p>
							<h3 onClick={()=>this._removeAlarm(alarm._id)} ><span className="glyphicon glyphicon-trash"><Link to="/alarmManager"></Link></span></h3>
						</div>
						)
				})}
			</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarms">
				</div>
			)
		}
	}
}