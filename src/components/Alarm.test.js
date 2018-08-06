import 'jest';
import { Alarm } from './Alarm';

describe('Alarm', () => {
  let alarm;

  beforeEach(() => {
    alarm = new Alarm();
  });

  it('should initialize with the proper initial state', () => {
    expect(alarm.state).toEqual({
      isRinging: false,
      awake: false,
      alarms: [],
      ringingAlarm: {},
    });
  });

  it('should ring when it is time for an alarm', () => {
    // Test to be written.
  });

  it('should change state to awake when an alarm is ringing', () => {
    // Test to be written.
  });
});
