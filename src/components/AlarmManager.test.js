import 'jest';
import React from 'react';
import moment from 'moment';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AlarmManager from './AlarmManager';

Enzyme.configure({ adapter: new Adapter() });

describe('AlarmManager', () => {
  let alarmManager;
  beforeEach(() => {
    alarmManager = Enzyme.shallow(<AlarmManager />);
  });
  it('should initialize with the proper state', () => {
    const expectedHour = parseInt(moment().format('mm'), 10) > 55 ? parseInt(moment().format('h'), 10) + 1 : parseInt(moment().format('h'), 10);
    let expectedMinute = Math.ceil((parseInt(moment().format('mm'), 10) / 5)) * 5;
    if (expectedMinute === 60) {
      expectedMinute = 0;
    }
    expect(alarmManager.state(['hour'])).toEqual(expectedHour);
    expect(alarmManager.state(['minute'])).toEqual(expectedMinute);
    expect(alarmManager.state(['ampm'])).toEqual(moment().format('a'));
    expect(alarmManager.state(['Monday'])).toEqual(false);
    expect(alarmManager.state(['Tuesday'])).toEqual(false);
    expect(alarmManager.state(['Wednesday'])).toEqual(false);
    expect(alarmManager.state(['Thursday'])).toEqual(false);
    expect(alarmManager.state(['Friday'])).toEqual(false);
    expect(alarmManager.state(['Saturday'])).toEqual(false);
    expect(alarmManager.state(['Sunday'])).toEqual(false);
    expect(alarmManager.state(['alarms'])).toEqual(expect.arrayContaining([]));
    expect(alarmManager.state(['daysOfWeek'])).toEqual(expect.arrayContaining([]));
  });

  it('should increment by one hour per click', () => {
    const expected = parseInt(alarmManager.state(['hour'])) + 1
    alarmManager.instance().incrementHour();
    expect(alarmManager.state(['hour'])).toBe(expected);
  });

  it('should increment hour 12 to 1', () => {
    alarmManager.setState({ hour: 12 });
    alarmManager.instance().incrementHour();
    expect(alarmManager.state(['hour'])).toBe(1);
  });

  it('should toggle ampm', () => {
    alarmManager.setState({ ampm: 'am' });
    alarmManager.instance().changeAMPM();
    expect(alarmManager.state(['ampm'])).toBe('pm');
    alarmManager.instance().changeAMPM();
    expect(alarmManager.state(['ampm'])).toBe('am');
  });

  it('should allow a user to select a day and unselect a day', () => {
    alarmManager.instance().chooseDay('Monday');
    expect(alarmManager.state(['Monday'])).toBe(true);
    expect(alarmManager.instance().daysOfWeek).toEqual(expect.arrayContaining(['Monday']));
    alarmManager.instance().chooseDay('Monday');
    expect(alarmManager.state(['Monday'])).toBe(false);
    expect(alarmManager.instance().daysOfWeek).toEqual(expect.arrayContaining([]));
  });
});
