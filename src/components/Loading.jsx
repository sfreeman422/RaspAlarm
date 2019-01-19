import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

let animateInterval;
let iconPosition = 1;
const mapStateToProps = state => ({
  error: state.applicationState.error,
  loadingMessage: state.applicationState.loadingMessage
});

class ConnectedLoading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: "wi wi-moon-waning-crescent-6 yellow"
    };
  }
  componentDidMount() {
    animateInterval = setInterval(this.changeIcon, 100);
  }
  componentWillUnmount() {
    clearInterval(animateInterval);
  }
  changeIcon = () => {
    const icons = [
      "wi wi-moon-waning-crescent-6 yellow",
      "wi wi-moon-waning-crescent-5 yellow",
      "wi wi-moon-waning-crescent-4 yellow",
      "wi wi-moon-waning-crescent-3 yellow",
      "wi wi-moon-waning-crescent-2 yellow",
      "wi wi-moon-waning-crescent-1 yellow",
      "wi wi-moon-third-quarter yellow",
      "wi wi-moon-waning-gibbous-6 yellow",
      "wi wi-moon-waning-gibbous-5 yellow",
      "wi wi-moon-waning-gibbous-4 yellow",
      "wi wi-moon-waning-gibbous-3 yellow",
      "wi wi-moon-waning-gibbous-2 yellow",
      "wi wi-moon-waning-gibbous-1 yellow",
      "wi wi-moon-full yellow",
      "wi wi-moon-waxing-gibbous-6 yellow",
      "wi wi-moon-waxing-gibbous-5 yellow",
      "wi wi-moon-waxing-gibbous-4 yellow",
      "wi wi-moon-waxing-gibbous-3 yellow",
      "wi wi-moon-waxing-gibbous-2 yellow",
      "wi wi-moon-waxing-gibbous-1 yellow",
      "wi wi-moon-first-quarter yellow",
      "wi wi-moon-waxing-crescent-6 yellow",
      "wi wi-moon-waxing-crescent-5 yellow",
      "wi wi-moon-waxing-crescent-4 yellow",
      "wi wi-moon-waxing-crescent-3 yellow",
      "wi wi-moon-waxing-crescent-2 yellow",
      "wi wi-moon-waxing-crescent-1 yellow",
      "wi wi-moon-new yellow"
    ];

    if (iconPosition > icons.length - 1) {
      iconPosition = 0;
    }
    this.setState({
      icon: icons[iconPosition]
    });
    iconPosition += 1;
  };

  render() {
    return (
      <div className="loading">
        <i className={this.state.icon} id="loading" />
        <br />
        <span className={this.props.error ? "error" : "loadingMessage"}>
          {this.props.error
            ? `${this.props.error} 
            Retrying...`
            : this.props.loadingMessage}
        </span>
      </div>
    );
  }
}

const Loading = connect(mapStateToProps)(ConnectedLoading);

ConnectedLoading.propTypes = {
  error: PropTypes.string,
  loadingMessage: PropTypes.string.isRequired
};

ConnectedLoading.defaultProps = {
  error: ""
};

export default Loading;
