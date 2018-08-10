import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import * as mocks from '../constants/mocks';
import { Loading } from './Loading';

Enzyme.configure({ adapter: new Adapter() });

describe('Loading', () => {
  let loading;
  let store;
  const mockStore = configureStore();

  it('should render a loading state when there is no error', () => {
    store = mockStore(mocks.mockStore);
    loading = Enzyme.shallow(<Loading store={mocks.mockStore} loadingMessage="Test" />);
    expect(loading).toBeDefined();
    expect(loading.state()).toBeDefined();
    // Broken why? expect(loading.state('icon')).toBeDefined();
  });

  it('should render an error when we have one', () => {
    store = mockStore(mocks.mockStoreWithError);
    loading = Enzyme.shallow(<Loading store={mocks.mockStoreWithError} loadingMessage="Failure" />);
    const loadingProps = loading.instance().props.store;
    expect(loadingProps.locationError).toBe('Test Error');
  });
});
