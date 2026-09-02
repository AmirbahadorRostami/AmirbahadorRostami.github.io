import { expect, test } from 'vitest';
import { toContactPayload, validateContact } from '../../src/lib/contact';

test('requires a valid reply address and meaningful message', () => {
  expect(
    validateContact({ name: '', email: 'bad', intent: 'employment', message: 'hi' }),
  ).toEqual({
    name: 'Tell me your name.',
    email: 'Enter a valid reply email.',
    message: 'Please include at least 20 characters.',
  });
});

test('normalizes valid visitor-provided values before validation', () => {
  expect(
    validateContact({
      name: '  Ada Lovelace  ',
      email: '  ada@example.com  ',
      intent: 'commission',
      message: '  I would like to discuss a collaborative installation.  ',
    }),
  ).toEqual({});
});

test('rejects values beyond the published field limits', () => {
  expect(
    validateContact({
      name: 'n'.repeat(101),
      email: 'visitor@example.com',
      intent: 'other',
      message: 'm'.repeat(4001),
    }),
  ).toEqual({
    name: 'Keep your name under 100 characters.',
    message: 'Keep your message under 4000 characters.',
  });
});

test('creates a trimmed delivery payload with an empty honeypot', () => {
  expect(
    toContactPayload({
      name: '  Ada Lovelace ',
      email: ' ada@example.com ',
      intent: 'residency',
      message: '  I would like to discuss a residency proposal. ',
    }),
  ).toEqual({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    intent: 'residency',
    message: 'I would like to discuss a residency proposal.',
    company: '',
  });
});
