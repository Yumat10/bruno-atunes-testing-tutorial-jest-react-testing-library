import { render, screen } from '@testing-library/react';
import { createMockRouter } from '../test-utils/createMockRouter';
import { BeautifulHeader } from './BeautifulHeader';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import user from '@testing-library/user-event';

it('renders h1 "Todo ID: 22"', () => {
  render(
    <RouterContext.Provider
      value={createMockRouter({
        query: {
          id: '22',
        },
      })}
    >
      <BeautifulHeader />
    </RouterContext.Provider>
  );
  expect(screen.getByText('Todo ID: 22')).toBeInTheDocument();
});

it('has an anchor tag with href="/contacts', () => {
  render(
    <RouterContext.Provider
      value={createMockRouter({
        query: {
          id: '33',
        },
        pathname: 'yuma',
        route: '/contacts/',
      })}
    >
      <BeautifulHeader />
    </RouterContext.Provider>
  );
  expect(screen.getByText('Contacts Page')).toHaveAttribute(
    'href',
    '/contacts?id=33&from=yuma'
  );
});

describe('when "Some Action" button is clicked', () => {
  it('calls router.push with "/contacts', () => {
    const router = createMockRouter({
      query: {
        id: '55',
      },
      pathname: 'tanaka',
      basePath: 'checkout',
    });
    render(
      <RouterContext.Provider value={router}>
        <BeautifulHeader />
      </RouterContext.Provider>
    );

    user.click(
      screen.getByRole('button', {
        name: 'Some Action',
      })
    );

    expect(router.push).toHaveBeenCalledWith(
      `/contacts?id=55&from=tanaka&something=checkout`
    );
    expect(router.push).toHaveBeenCalledTimes(1);
  });
});
