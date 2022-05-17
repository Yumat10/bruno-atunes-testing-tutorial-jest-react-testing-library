import { render, screen, within, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import { MultiStepForm } from './MultiStepForm';

describe('MultiStepForm', () => {
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
    render(<MultiStepForm onSubmit={onSubmit} />);
  });

  it('onSubmit is called when all fields pass validation', async () => {
    user.type(getFirstName(), 'Bruno');
    selectJobsituation('Full-Time');
    user.type(getCity(), 'Vila Real');
    user.click(getIsMillionare());
    clickNextButton();

    // 2nd
    user.type(await findMoney(), '1000000');
    clickNextButton();

    // 3nd
    user.type(await findDescription(), 'hello');
    clickSubmitButton();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      city: 'Vila Real',
      description: 'hello',
      firstName: 'Bruno',
      job: 'FULL',
      millionaire: true,
      money: 1000000,
    });
  });

  it('has 3 required fields on first step', async () => {
    clickNextButton();

    await waitFor(() => {
      expect(getFirstName()).toHaveErrorMessage('Your First Name is Required');
    });
    expect(getCity()).toHaveErrorMessage('city is a required field');

    expect(getJobSituation()).toHaveErrorMessage(
      'You need to select your job situation'
    );
  });

  describe('city field', () => {
    it('shows errors when city has less than 8 chars', async () => {
      user.type(getCity(), '1234567');
      user.tab();
      await waitFor(() => {
        expect(getCity()).toHaveErrorMessage(
          'city must be at least 8 characters'
        );
      });
    });

    it('shows errors when city has more than 11 chars', async () => {
      user.type(getCity(), '123456789012');
      user.tab();
      await waitFor(() => {
        expect(getCity()).toHaveErrorMessage(
          'city must be at most 11 characters'
        );
      });
    });
  });

  describe('money field', () => {
    it('checkbox checked but less than 1,000,000', async () => {
      user.type(getFirstName(), 'Bruno');
      selectJobsituation('Full-Time');
      user.type(getCity(), 'Vila Real');
      user.click(getIsMillionare());
      clickNextButton();

      // 2nd
      user.type(await findMoney(), '100');
      clickNextButton();

      await waitFor(async () => {
        expect(await findMoney()).toHaveErrorMessage(
          'Because you said you are a millionaire you need to have 1 million'
        );
      });
    });
  });
});

function getFirstName() {
  return screen.getByRole('textbox', {
    name: /first name/i,
  });
}

function getCity() {
  return screen.getByRole('textbox', { name: /city/i });
}

function getJobSituation() {
  return screen.getByRole('combobox', {
    name: /job situation/i,
  });
}

function getIsMillionare() {
  return screen.getByRole('checkbox', {
    name: /I am a millionaire/i,
  });
}

function findMoney() {
  return screen.findByRole('spinbutton', {
    name: /All the money I have/i,
  });
}

function findDescription() {
  return screen.findByRole('textbox', {
    name: /Description/i,
  });
}

function clickNextButton() {
  const nextButton = screen.getByRole('button', { name: /Next/i });
  user.click(nextButton);
}

function clickSubmitButton() {
  const submitButton = screen.getByRole('button', { name: /Submit/i });
  user.click(submitButton);
}

function selectJobsituation(jobSituation: string) {
  const dropdown = getJobSituation();
  user.selectOptions(
    dropdown,
    within(dropdown).getByRole('option', { name: jobSituation })
  );
}
