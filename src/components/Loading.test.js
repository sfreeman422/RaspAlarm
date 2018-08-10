import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as mocks from '../constants/mocks';
import { Loading } from './Loading';

Enzyme.configure({ adapter: new Adapter() });

describe('Loading', () => {
  let loading;

  it('should initialize properly without an error', () => {
    loading = Enzyme.shallow(<Loading store={mocks.mockStore} loadingMessage="Test" />);
    expect(loading).toBeDefined();
    expect(loading.state()).toBeDefined();
    expect(loading.state('icon')).toBeDefined();
  });

  it('should initialize properly with an error', () => {
    loading = Enzyme.shallow(<Loading store={mocks.mockStoreWithError} loadingMessage="Failure" />);
    const loadingProps = loading.instance().props.store;
    expect(loadingProps.locationError).toBe('Test Error');
  });
});
