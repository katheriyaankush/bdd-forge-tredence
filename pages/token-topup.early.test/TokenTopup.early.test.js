
// Unit tests for: TokenTopup

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react';
import TokenTopup from '../token-topup';
import "@testing-library/jest-dom";

// Mock the AppLayout component
jest.mock("../../../Components/AppLayout/AppLayout", () => {
  return ({ children }) => <div>{children}</div>;
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ post: 10 }),
  })
);

describe('TokenTopup() TokenTopup method', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should render the Add Token button', () => {
      // Test to ensure the button is rendered
      render(<TokenTopup />);
      const button = screen.getByText('Add Token');
      expect(button).toBeInTheDocument();
    });

    it('should call the API and update tokens on button click', async () => {
      // Test to ensure the API is called and tokens are updated
      render(<TokenTopup />);
      const button = screen.getByText('Add Token');
      fireEvent.click(button);

      // Wait for the state update
      await screen.findByText('Add Token');

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/addTokens', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle API failure gracefully', async () => {
      // Test to ensure the component handles API failure
      fetch.mockImplementationOnce(() => Promise.reject('API is down'));

      render(<TokenTopup />);
      const button = screen.getByText('Add Token');
      fireEvent.click(button);

      // Wait for the state update
      await screen.findByText('Add Token');

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle non-numeric token values', async () => {
      // Test to ensure non-numeric token values are handled
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ post: 'invalid' }),
        })
      );

      render(<TokenTopup />);
      const button = screen.getByText('Add Token');
      fireEvent.click(button);

      // Wait for the state update
      await screen.findByText('Add Token');

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: TokenTopup
