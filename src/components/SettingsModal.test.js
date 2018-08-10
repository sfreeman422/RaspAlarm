import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as mocks from '../constants/mocks';
import { Settings } from './SettingsModal';

Enzyme.configure({ adapter: new Adapter() });

describe('SettingsModal', () => {
  let modal;

  it('should shallow mount properly', () => {
    modal = Enzyme.shallow(<Settings store={mocks.mockStore} />);
    expect(modal).toBeDefined();
  });
});

