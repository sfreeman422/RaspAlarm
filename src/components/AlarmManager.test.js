import 'jest';
import moment from 'moment';
import AlarmManager from './AlarmManager';

describe('AlarmManager', () => {
  let alarmManager;
  beforeEach(() => {
    alarmManager = new AlarmManager();
  });
  it('should initialize with the proper state', () => {
    expect(alarmManager.state.hour).toEqual(parseInt(moment().format('h'), 10));
    expect(alarmManager.state.minute).toBeUndefined();
    expect(alarmManager.state.ampm).toEqual(moment().format('a'));
    expect(alarmManager.state.Monday).toEqual(false);
    expect(alarmManager.state.Tuesday).toEqual(false);
    expect(alarmManager.state.Wednesday).toEqual(false);
    expect(alarmManager.state.Thursday).toEqual(false);
    expect(alarmManager.state.Friday).toEqual(false);
    expect(alarmManager.state.Saturday).toEqual(false);
    expect(alarmManager.state.Sunday).toEqual(false);
    expect(alarmManager.state.alarms).toEqual([]);
    expect(alarmManager.daysOfWeek).toEqual([]);
  });

  it('should increment by one hour per click', () => {
    alarmManager.state.hour = 1;
    alarmManager.incrementHour();
    expect(alarmManager.state.hour).toBe(2);
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
