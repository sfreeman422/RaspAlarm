import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SettingsModal from "./SettingsModal";

const mapStateToProps = state => ({
  day: state.today,
  date: state.date,
  userLoc: state.userLoc
});

class ConnectedToday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  render() {
    const { day, date, userLoc } = this.props;
    return (
      <div className="today">
        <div className="weekday">
          <p id="dayAndLoc">
            {day}, {date}
            {userLoc !== "" ? <span> in {userLoc} </span> : null}
            <i className="material-icons" onClick={() => this.toggleModal()}>
              {" "}
              settings{" "}
            </i>
          </p>
        </div>
        <SettingsModal
          isOpen={this.state.isModalOpen}
          toggleModal={() => this.toggleModal()}
        />
      </div>
    );
  }
}

ConnectedToday.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  userLoc: PropTypes.string
};

ConnectedToday.defaultProps = {
  userLoc: ""
};

const Today = connect(mapStateToProps)(ConnectedToday);
export default Today;
