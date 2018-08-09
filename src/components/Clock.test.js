import 'jest';
import React from 'react';
import moment from 'moment';
import * as mocks from '../constants/mocks';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Clock } from './Clock';

Enzyme.configure({ adapter: new Adapter() });

describe('Clock', () => {
  let clock;
  let store;
  const mockStore = configureStore();

  beforeEach(() => {
    store = mockStore(mocks.mockStore);
    clock = Enzyme.shallow(<Clock store={store} />);
  });

  it('should initialize with initial state', () => {
    expect(clock.state(['isColonVisible'])).toBe(false);
  });

  it('should initialize with intiial functions', () => {
    expect(clock.instance().blinkColon).toBeDefined();
  });

  it('should receive time and blinkingColon from state', () => {
    // Set time and blinking colon on mock store.
    // Check that the store includes time and blinkingColon
  });

  it('should respond to changes in blinkingColon', () => {
    // Set blinkingColon to true
    // Test that we blink
    // Set blinkingColon to false
    // Test that we blink
  });

  it('should render the time', () => {
    // Adjust time on store
    // Check that the right time is on the page.
  });

  it('should render the time with blinking colon', () => {
    // Adjust the blinkTime to be true
    // Test that the component recognizes this as true
    // Check that blinkInterval is set.
  });
});
