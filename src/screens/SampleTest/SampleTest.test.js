
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import SampleTest from './SampleTest';

test('Renders snapshot as expected', () => {
  // const tree = renderer.create(<SampleTest />).toJSON();
  // expect(tree).toMatchSnapshot();
  const renderer = new ShallowRenderer();
  renderer.render(<SampleTest />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
