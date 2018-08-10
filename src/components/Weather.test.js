import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import * as mocks from '../constants/mocks';
import Weather from './Weather';

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
    expect(weather.props().weatherArr).toEqual(expect.arrayContaining(mocks.weatherArr));
  });
});

