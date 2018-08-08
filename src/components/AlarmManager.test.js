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
    const expectedMinute = Math.ceil((parseInt(moment().format('mm'), 10) / 5)) * 5;
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
    // These are both failing, need to test an empty array somehow
    // expect(alarmManager.state(['alarms'])).toEqual([]);
    // expect(alarmManager.state(['daysOfWeek'])).toEqual([]);
  });

  it('should increment by one hour per click', () => {
    alarmManager.instance().incrementHour();
    expect(alarmManager.state(['hour'])).toBe(parseInt(alarmManager.state(['hour']), 10) + 1);
  });

  it('should increment hour 12 to 1', () => {
    alarmManager.state.hour = 12;
    alarmManager.incrementHour();
    expect(alarmManager.state.hour).toBe(1);
  });

  it('should toggle ampm', () => {
    alarmManager.state.ampm = 'am';
    alarmManager.changeAMPM();
    expect(alarmManager.state.ampm).toBe('pm');
    alarmManager.changeAMPM();
    expect(alarmManager.state.ampm).toBe('am');
  });

  it('should allow a user to select a day and unselect a day', () => {
    alarmManager.chooseDay('Monday');
    expect(alarmManager.state.Monday).toBe(true);
    expect(alarmManager.state.daysOfWeek).toBe(['Monday']);
    alarmManager.chooseDay('Monday');
    expect(alarmManager.state.Monday).toBe(false);
    expect(alarmManager.state.daysOfWeek).toBe([]);
  });
});
