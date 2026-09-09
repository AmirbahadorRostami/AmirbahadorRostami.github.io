export type ContactIntent = 'employment' | 'commission' | 'residency' | 'other';
export type ContactState = 'ready' | 'sending' | 'success' | 'error' | 'unconfigured';

export interface ContactFields {
  name: string;
  email: string;
  intent: ContactIntent;
  message: string;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (!name) errors.name = 'Tell me your name.';
  else if (name.length > 100) errors.name = 'Keep your name under 100 characters.';

  if (!emailPattern.test(email)) errors.email = 'Enter a valid reply email.';

  if (message.length < 20) errors.message = 'Please include at least 20 characters.';
  else if (message.length > 4000) errors.message = 'Keep your message under 4000 characters.';

  return errors;
}

export function toContactPayload(fields: ContactFields): Record<string, string> {
  return {
    name: fields.name.trim(),
    email: fields.email.trim(),
    intent: fields.intent.trim(),
    message: fields.message.trim(),
    company: '',
  };
}
