import 'jest';
import React from 'react';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Today } from './Today';

Enzyme.configure({ adapter: new Adapter() });

describe('Today', () => {
  let today;

  beforeEach(() => {
    today = Enzyme.shallow(<Today />);
  });

  it('should initialize state properly', () => {
    expect(today.state(['isModalOpen'])).toBe(false);
  });

  it('should toggle the modal properly', () => {
    expect(today.state(['isModalOpen'])).toBe(false);
    today.instance().toggleModal();
    expect(today.state(['isModalOpen'])).toBe(true);
    today.instance().toggleModal();
    expect(today.state(['isModalOpen'])).toBe(false);
  });
});
