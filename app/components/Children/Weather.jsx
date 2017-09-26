import React from 'react';

const Weather = props => (
  <div className="col-xs-12 allWeather">
    <div className="col-xs-2 weatherProp">
      <i className={props.todayPic} />
      <div className="weatherDescription">
        <p>{props.todayTemp}</p>
        <p>{props.today}</p>
        <p>{props.todayHour}</p>
      </div>
    </div>
    <div className="col-xs-2 weatherOne">
      <i className={props.onePic} />
      <div className="weatherDescription">
        <p>{props.oneTemp}</p>
        <p>{props.one}</p>
        <p>{props.oneHour}</p>
      </div>
    </div>
    <div className="col-xs-2 weatherTwo">
      <i className={props.twoPic} />
      <div className="weatherDescription">
        <p>{props.twoTemp}</p>
        <p>{props.two}</p>
        <p>{props.twoHour}</p>
      </div>
    </div>
    <div className="col-xs-2 weatherThree">
      <i className={props.threePic} />
      <div className="weatherDescription">
        <p>{props.threeTemp}</p>
        <p>{props.three}</p>
        <p>{props.threeHour}</p>
      </div>
    </div>
    <div className="col-xs-2 weatherFour">
      <i className={props.fourPic} />
      <div className="weatherDescription">
        <p>{props.fourTemp}</p>
        <p>{props.four}</p>
        <p>{props.fourHour}</p>
      </div>
    </div>
    <div className="col-xs-2 weatherFive">
      <i className={props.fivePic} />
      <div className="weatherDescription">
        <p>{props.fiveTemp}</p>
        <p>{props.five}</p>
        <p>{props.fiveHour}</p>
      </div>
    </div>
  </div>
    );
export default Weather;
