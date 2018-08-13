import 'jest';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as mocks from '../constants/mocks';
import CurrentAlarms from './CurrentAlarms';

Enzyme.configure({ adapter: new Adapter() });

describe('CurrentAlarms', () => {
  it('should map an array of alarms', () => {
    const removeAlarm = jest.fn();
    const currentAlarms = Enzyme.shallow(<CurrentAlarms alarms={mocks.mockAlarms} removeAlarm={removeAlarm} />);
    const props = currentAlarms.props();
    expect(props.children).toEqual(expect.arrayContaining(mocks.mockAlarms));
  });
});
