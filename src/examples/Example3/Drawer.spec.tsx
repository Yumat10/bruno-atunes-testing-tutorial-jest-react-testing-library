import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { MyDrawer } from './Drawer';
import user from '@testing-library/user-event';

// use jest.mock factory and show require actual
jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  SwipeableDrawer: jest.fn(() => <div>Hello World!</div>),
}));

describe('Drawer', () => {
  it('shows no "Hello World!"', () => {
    render(<MyDrawer />);
    expect(screen.queryByText('Hello World!')).toBeInTheDocument();
  });

  it('clicking on "Open Drawer" Button shows "Hello World!"', () => {
    render(<MyDrawer />);
    user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });
});
