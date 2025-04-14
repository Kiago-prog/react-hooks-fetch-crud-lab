import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../components/App';

describe('App Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays question prompts after fetching', async () => {
    global.fetch.mockResolvedValue({
      json: async () => [
        { id: 1, prompt: 'What is your name?', answer: 'Unknown' },
        { id: 2, prompt: 'What is your age?', answer: 'Unknown' },
      ],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('What is your name?')).toBeInTheDocument();
      expect(screen.getByText('What is your age?')).toBeInTheDocument();
    });
  });

  test('creates a new question when the form is submitted', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ id: 3, prompt: 'Where are you from?', answer: 'Unknown' }),
    });

    render(<App />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Where are you from?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Question/i }));

    await waitFor(() => {
      expect(screen.getByText('Where are you from?')).toBeInTheDocument();
    });
  });

  test('deletes the question when the delete button is clicked', async () => {
      global.fetch.mockResolvedValueOnce({
          json: async () => [
              { id: 1, prompt: "What is your name?", answer: "Unknown" },
          ],
      });
      global.fetch.mockResolvedValueOnce({}); // Mock for the DELETE request

      render(<App />);

      await waitFor(() => screen.getByText("What is your name?"));
      fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

      await waitFor(() => {
          expect(screen.queryByText("What is your name?")).toBeNull();
      });
  });

  test('updates the answer when the dropdown is changed', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [{ id: 1, prompt: 'What is your name?', answer: 'Unknown' }],
    });
    global.fetch.mockResolvedValueOnce({});

    render(<App />);

    await waitFor(() => screen.getByText('What is your name?'));
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Yes' } });
    await waitFor(() => expect(screen.getByText('Answer: Yes')).toBeInTheDocument());
  });
});