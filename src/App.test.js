import 'jest';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as mocks from '../constants/mocks';
import { ConnectedMain } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  it('should generate weather state should drop the first index if hour is equal to current hour', () => {
    const app = Enzyme.shallow(<ConnectedMain />);
    app.instance().generateWeatherState(mocks.weatherArr);
  });
});
