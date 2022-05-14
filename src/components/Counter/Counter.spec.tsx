import { render, screen } from '@testing-library/react';
import { Counter } from './Counter';
import user from '@testing-library/user-event';

describe('Counter', () => {
  describe('intialized with defaultCount=1 and description="WWW"', () => {
    beforeEach(() => {
      render(<Counter defaultCount={1} description="WWW" />);
    });

    it('renders "Current Count: 1"', () => {
      expect(screen.getByText('Current Count: 1')).toBeInTheDocument();
    });

    it('renders DC: 1', () => {
      expect(screen.getByText(/DC: 1/)).toBeInTheDocument();
    });

    it('renders title as "WWW"', () => {
      expect(screen.getByText(/WWW/)).toBeInTheDocument();
    });

    describe('when the incrementor changes to 2 and "+" button is clicked', () => {
      beforeEach(() => {
        user.type(screen.getByLabelText(/Incrementor/), '{selectall}2');
        user.click(
          screen.getByRole('button', {
            name: 'Increment counter',
          })
        );
      });

      it('renders "Current Count: 3"', () => {
        expect(screen.getByText('Current Count: 3')).toBeInTheDocument();
      });
    });

    describe('when the incrementor changes to 3 and "-" button is clicked', () => {
      beforeEach(() => {
        user.type(screen.getByLabelText(/Incrementor/), '{selectall}3');
        user.click(
          screen.getByRole('button', {
            name: 'Decrement counter',
          })
        );
      });

      it('renders "Current Count: -2"', () => {
        expect(screen.getByText('Current Count: -2')).toBeInTheDocument();
      });
    });

    describe('when the incrementor changes to 4 and "+" button is clicked 3 times', () => {
      beforeEach(() => {
        user.type(screen.getByLabelText(/Incrementor/), '{selectall}4');
        for (let i = 0; i < 3; i++) {
          user.click(
            screen.getByRole('button', {
              name: 'Increment counter',
            })
          );
        }
      });

      it('renders "Current Count: 10"', () => {
        expect(screen.getByText('Current Count: 10')).toBeInTheDocument();
      });

      it('disables "+" button', () => {
        expect(
          screen.getByRole('button', {
            name: 'Increment counter',
          })
        ).toBeDisabled();
      });
    });

    describe('when the incrementor changes to 3 and "-" button is clicked 4 times', () => {
      beforeEach(() => {
        user.type(screen.getByLabelText(/Incrementor/), '{selectall}3');
        for (let i = 0; i < 4; i++) {
          user.click(
            screen.getByRole('button', {
              name: 'Decrement counter',
            })
          );
        }
      });

      it('renders "Current Count: -10"', () => {
        expect(screen.getByText('Current Count: -10')).toBeInTheDocument();
      });

      it('disables "-" button', () => {
        expect(
          screen.getByRole('button', {
            name: 'Decrement counter',
          })
        ).toBeDisabled();
      });
    });
  });

  describe('intialized with defaultCount=0 and description="My Counter"', () => {
    beforeEach(() => {
      render(<Counter defaultCount={0} description="My Counter" />);
    });

    it('renders DC: 0', () => {
      expect(screen.getByText(/DC: 0/)).toBeInTheDocument();
    });

    it('renders "Current Count: 0"', () => {
      expect(screen.getByText('Current Count: 0')).toBeInTheDocument();
    });

    it('renders title as "My Counter"', () => {
      expect(screen.getByText(/My Counter/)).toBeInTheDocument();
    });

    describe('when + is clicked', () => {
      beforeEach(() => {
        user.click(
          screen.getByRole('button', {
            name: 'Increment counter',
          })
        );
      });

      it('renders "Current count: 1"', () => {
        expect(screen.getByText('Current Count: 1')).toBeInTheDocument();
      });
    });

    describe('when - is clicked', () => {
      beforeEach(() => {
        user.click(
          screen.getByRole('button', {
            name: 'Decrement counter',
          })
        );
      });

      it('renders "Current count: -1"', () => {
        expect(screen.getByText('Current Count: -1')).toBeInTheDocument();
      });
    });
  });
});
