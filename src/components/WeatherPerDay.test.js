import 'jest';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as mocks from '../constants/mocks';
import WeatherPerDay from './WeatherPerDay';

Enzyme.configure({ adapter: new Adapter() });

describe('WeatherPerDay', () => {
  it('should initialize with given props', () => {
    const weather = Enzyme.shallow(<WeatherPerDay weatherItem={mocks.mockStore.weatherArr[0]} up={false} showDeltas celcius={false} ignoreUpIndicator={false} />);
    expect(weather.props(['weatherItem'])).toEqual(mocks.mockStore.weatherArr[0]);
    expect(weather.props().up).toBe(false);
    expect(weather.props().showDeltas).toBe(true);
    expect(weather.props().celcius).toBe(false);
    expect(weather.props().ignoreUpIndicator).toBe(false);
  });
});
