import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Weather from './Weather';
import configureStore from 'redux-mock-store';
import * as mocks from '../constants/mocks';

Enzyme.configure({ adapter: new Adapter() });

describe('Weather', () => {
  let weather;
  let store;
  const mockStore = configureStore();

  beforeEach(() => {
    store = mockStore(mocks.mockStore);
    weather = Enzyme.shallow(<Weather store={store} />);
  });
  // This is probably not the right way to test stateless components.
  it('should render the weather', () => {
    expect(weather).toBeDefined();
  });

  it('should receive mock weather objects', () => {
    weather = Enzyme.shallow(<Weather store={store} />);
    expect(weather.props().weatherArr).toEqual(expect.arrayContaining(mocks.weatherArr));
  });
});

