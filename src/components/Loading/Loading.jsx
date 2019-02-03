import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as cn from "classnames";
import * as styles from "./Loading.module.css";

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
      icon: cn("wi wi-moon-waning-crescent-6", styles.yellow)
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
      cn("wi wi-moon-waning-crescent-6", styles.yellow),
      cn("wi wi-moon-waning-crescent-5", styles.yellow),
      cn("wi wi-moon-waning-crescent-4", styles.yellow),
      cn("wi wi-moon-waning-crescent-3", styles.yellow),
      cn("wi wi-moon-waning-crescent-2", styles.yellow),
      cn("wi wi-moon-waning-crescent-1", styles.yellow),
      cn("wi wi-moon-third-quarter", styles.yellow),
      cn("wi wi-moon-waning-gibbous-6", styles.yellow),
      cn("wi wi-moon-waning-gibbous-5", styles.yellow),
      cn("wi wi-moon-waning-gibbous-4", styles.yellow),
      cn("wi wi-moon-waning-gibbous-3", styles.yellow),
      cn("wi wi-moon-waning-gibbous-2", styles.yellow),
      cn("wi wi-moon-waning-gibbous-1", styles.yellow),
      cn("wi wi-moon-full", styles.yellow),
      cn("wi wi-moon-waxing-gibbous-6", styles.yellow),
      cn("wi wi-moon-waxing-gibbous-5", styles.yellow),
      cn("wi wi-moon-waxing-gibbous-4", styles.yellow),
      cn("wi wi-moon-waxing-gibbous-3", styles.yellow),
      cn("wi wi-moon-waxing-gibbous-2", styles.yellow),
      cn("wi wi-moon-waxing-gibbous-1", styles.yellow),
      cn("wi wi-moon-first-quarter", styles.yellow),
      cn("wi wi-moon-waxing-crescent-6", styles.yellow),
      cn("wi wi-moon-waxing-crescent-5", styles.yellow),
      cn("wi wi-moon-waxing-crescent-4", styles.yellow),
      cn("wi wi-moon-waxing-crescent-3", styles.yellow),
      cn("wi wi-moon-waxing-crescent-2", styles.yellow),
      cn("wi wi-moon-waxing-crescent-1", styles.yellow),
      cn("wi wi-moon-new", styles.yellow)
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
    const { icon } = this.state;
    const { error, loadingMessage } = this.props;
    return (
      <div className={styles.loading}>
        <i className={icon} />
        <br />
        <span className={error ? styles.errorMessage : styles.loadingMessage}>
          {error
            ? `${error} 
            Retrying...`
            : loadingMessage}
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
