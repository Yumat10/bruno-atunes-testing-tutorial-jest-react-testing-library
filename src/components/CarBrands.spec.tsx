import {
  render,
  RenderOptions,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React, { FC, ReactElement } from 'react';
import { CarBrands } from './CarBrands';
import { MySwrConfig } from './MySwrConfig';
import { setupServer } from 'msw/node';
import { DefaultRequestBody, PathParams, rest } from 'msw';

const server = setupServer(
  rest.get<DefaultRequestBody, PathParams, string[]>(
    '/api/cars/france',
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json([`Custom France xB1`, `Custom France xB2`])
      );
    }
  ),
  rest.get<DefaultRequestBody, PathParams, string[]>(
    '/api/cars/germany',
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json([`Custom Germany xB1`, `Custom Germany xB2`])
      );
    }
  ),
  rest.get<DefaultRequestBody, PathParams, { message: string }>(
    '/api/cars/italy',
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.status(500),
        ctx.json({ message: 'Unit test message' })
      );
    }
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('Car Brands', () => {
  describe('when "France" is selected', () => {
    beforeEach(async () => {
      render(
        <MySwrConfig>
          <CarBrands country="France" />
        </MySwrConfig>
      );

      await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
    });

    it('renders "Car Brands from France"', () => {
      const element = screen.getByText('Car Brands from France');
      expect(element).toBeInTheDocument();
    });

    it('renders the expected brands', () => {
      expect(screen.getByText('Custom France xB1')).toBeInTheDocument();
      expect(screen.getByText('Custom France xB2')).toBeInTheDocument();
    });
  });

  describe('when "Germany" is selected', () => {
    beforeEach(async () => {
      customRender(
        <MySwrConfig>
          <CarBrands country="Germany" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
    });

    it('renders "Car Brands from Germany"', () => {
      const element = screen.getByText('Car Brands from Germany');
      expect(element).toBeInTheDocument();
    });

    it('renders the expected brands', () => {
      expect(screen.getByText('Custom Germany xB1')).toBeInTheDocument();
      expect(screen.getByText('Custom Germany xB2')).toBeInTheDocument();
    });
  });

  describe('when "Italy" is selected', () => {
    beforeEach(async () => {
      customRender(<CarBrands country="Italy" />);

      await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
    });

    it('renders "Car Brands from Italy"', () => {
      const element = screen.getByText('Car Brands from Italy');
      expect(element).toBeInTheDocument();
    });

    it('show expected error message', () => {
      expect(screen.getByText('Unit test message')).toBeInTheDocument();
    });
  });

  describe('when no results returned', () => {
    beforeEach(async () => {
      server.use(
        rest.get<DefaultRequestBody, PathParams, string[]>(
          '/api/cars/france',
          (req, res, ctx) => {
            return res(ctx.delay(100), ctx.json([]));
          }
        )
      );
      customRender(
        <MySwrConfig>
          <CarBrands country="France" />
        </MySwrConfig>
      );

      await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
    });

    it('show expected no data message', () => {
      expect(screen.getByText('No Data to Show')).toBeInTheDocument();
    });
  });
});

const AllTheProviders: FC = ({ children }) => {
  return (
    <MySwrConfig disableCache swrConfig={{ dedupingInterval: 0 }}>
      {children}
    </MySwrConfig>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });
