import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
  day: state.today,
  date: state.date,
  userLoc: state.userLoc,
  showDeltas: state.showDeltas,
  celcius: state.celcius,
  coloredIcons: state.coloredIcons,
});

const mapDispatchToProps = dispatch => ({
  adjustDeltas: delta => dispatch(actions.adjustDeltas(delta)),
  showCelcius: celcius => dispatch(actions.showCelcius(celcius)),
  showColoredIcons: showIcons => dispatch(actions.showColoredIcons(showIcons)),
});

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    backgroundColor: 'black',
    color: 'white',
    width: '80%',
    height: '40%',
    margin: 'auto auto',
    textAlign: 'center',
    justifyContent: 'center',
  },
};

class ConnectedToday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      temperaturePrecision: true,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    console.log('afterOpenModal triggered');
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const {
      day,
      date,
      userLoc,
      showDeltas,
      adjustDeltas,
      celcius,
      showCelcius,
      showColoredIcons,
      coloredIcons,
    } = this.props;
    console.log(this.props.showDeltas);
    return (
      <div className="today">
        <div className="weekday">
          <p id="dayAndLoc">{day}, {date}
            {userLoc !== '' ? <span onClick={() => console.log('user location was clicked.')}> in {userLoc} </span> : null}
            <i className="material-icons" onClick={() => this.openModal()}> settings </i>
          </p>
        </div>
        <Modal isOpen={this.state.modalIsOpen} style={modalStyle}>
          <h1>Settings</h1>
          <table>
            <tbody>
              <tr>
                <td>Locations: </td>
                <td>{userLoc} </td>
                <td />
                <td>Add Location: </td>
                <td><input type="text" placeholder="Zip Code" /></td>
              </tr>
              <tr>
                <td>Prefer Celcius? </td>
                <td><input type="checkbox" checked={celcius} onChange={() => showCelcius(!celcius)} /></td>
              </tr>
              <tr>
                <td>Show Temperature Delta Indicators? </td>
                <td><input type="checkbox" checked={showDeltas} onChange={() => adjustDeltas(!showDeltas)} /></td>
              </tr>
              <tr>
                <td>Show Colored Sun Icon? </td>
                <td><input type="checkbox" checked={coloredIcons} onChange={() => showColoredIcons(!coloredIcons)} /></td>
              </tr>
              <tr>
                <td>Precise Temperatures? </td>
                <td><input type="checkbox" checked={this.state.temperaturePrecision} onChange={() => this.setState({ temperaturePrecision: !this.state.temperaturePrecision })} /></td>
              </tr>
            </tbody>
          </table>
          <button id="modal-button" onClick={() => this.closeModal()}>Close</button>
        </Modal>
      </div>
    );
  }
}

ConnectedToday.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  userLoc: PropTypes.string,
  showDeltas: PropTypes.bool.isRequired,
  adjustDeltas: PropTypes.func.isRequired,
  celcius: PropTypes.bool.isRequired,
  showCelcius: PropTypes.func.isRequired,
  showColoredIcons: PropTypes.func.isRequired,
  coloredIcons: PropTypes.bool.isRequired,
};

ConnectedToday.defaultProps = {
  userLoc: '',
};

const Today = connect(mapStateToProps, mapDispatchToProps)(ConnectedToday);
export default Today;
