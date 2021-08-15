import React from 'react';
import {fireEvent, queryAllByTestId, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';


test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
    const {getByText} = render(<ContactForm />);
    const header = getByText(/contact form/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).not.toBeUndefined()
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name/i);
    let errorID = screen.queryByTestId('error');
    expect(errorID).not.toBeInTheDocument();

    userEvent.type(firstNameInput, "four");

    errorID = screen.getByText(/error/i);
    expect(errorID).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const clickSubmit = screen.getByRole('button', {name: /submit/i})

    fireEvent.click(clickSubmit);
  
    const firstNameInputError = screen.getByText(/firstName must have at least 5 characters./i);
    const lastNameInputError = screen.getByText(/lastName is a required field./i);
    const emailInputError = screen.getByText(/email must be a valid email address./i);

    expect(firstNameInputError).toBeInTheDocument();
    expect(lastNameInputError).toBeInTheDocument();
    expect(emailInputError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const clickSubmit = screen.getByRole('button', {name: /submit/i})
    
    userEvent.type(firstNameInput, "Dalian");
    userEvent.type(lastNameInput, "Simpson");
    userEvent.click(clickSubmit);

    const emailInputError = screen.getByText(/email must be a valid email address./i);

    expect(emailInputError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/email/i);

    userEvent.type(emailInput, 'Dalian.com')
    
    const emailInputError = screen.getByText(/email must be a valid email address./i);
    expect(emailInputError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const clickSubmit = screen.getByRole('button', {name: /submit/i});

    userEvent.click(clickSubmit); 
    userEvent.type(firstNameInput, "Dalian");
    userEvent.type(emailInput, 'Dalian@fakeEmail.com');

    const lastNameInputError = screen.getByText(/lastName is a required field./i);
    expect(lastNameInputError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const clickSubmit = screen.getByRole('button', {name: /submit/i});

    userEvent.type(firstNameInput, "Dalian");
    userEvent.type(lastNameInput, "Simpson");
    userEvent.type(emailInput, 'Dalian@fakeEmail.com');
    userEvent.click(clickSubmit); 

    const submittedFirstName = screen.getByTestId(/firstnameDisplay/i)
    const submittedLastName = screen.getByTestId(/lastnameDisplay/i)
    const submittedEmail = screen.getByTestId(/emailDisplay/i)
    const submittedMessage = screen.queryByTestId(/messageDisplay/i)

    expect(submittedFirstName).toBeInTheDocument();
    expect(submittedLastName).toBeInTheDocument();
    expect(submittedEmail).toBeInTheDocument();
    expect(submittedMessage).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i)
    const clickSubmit = screen.getByRole('button', {name: /submit/i});

    userEvent.type(firstNameInput, "Dalian");
    userEvent.type(lastNameInput, "Simpson");
    userEvent.type(emailInput, 'Dalian@fakeEmail.com');
    userEvent.type(messageInput, 'test message')
    userEvent.click(clickSubmit); 

    const submittedFirstName = screen.getByTestId(/firstnameDisplay/i)
    const submittedLastName = screen.getByTestId(/lastnameDisplay/i)
    const submittedEmail = screen.getByTestId(/emailDisplay/i)
    const submittedMessage = screen.queryByTestId(/messageDisplay/i)

    expect(submittedFirstName).toBeInTheDocument();
    expect(submittedLastName).toBeInTheDocument();
    expect(submittedEmail).toBeInTheDocument();
    expect(submittedMessage).toBeInTheDocument();
});