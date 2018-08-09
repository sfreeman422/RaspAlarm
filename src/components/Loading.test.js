import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import * as mocks from '../constants/mocks';
import * as actions from '../actions/actions';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import Loading from './Loading';

Enzyme.configure({ adapter: new Adapter() });

describe('Loading', () => {
  let loading;
  let store;
  const mockStore = configureStore();

  beforeEach(() => {
    store = mockStore(mocks.mockStore);
    loading = Enzyme.shallow(<Loading store={store} />);
  });

  it('should render a loading state when there is no error', () => {
    expect(loading).toBeDefined();
    expect(loading.state()).toBeDefined();
    // Broken why? expect(loading.state('icon')).toBeDefined();
  });

  it('should render an error when we have one', () => {
    // This dispatch is not doing anything. Why?
    store.dispatch(actions.reportError('Test error'));
    expect(loading.props().locationError).toBe('Test error');
  });
});
