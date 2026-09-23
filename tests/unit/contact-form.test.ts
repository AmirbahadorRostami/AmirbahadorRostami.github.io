import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('../../src/config/site', () => ({
  SITE: { linkedInUrl: 'https://www.linkedin.com/in/test-fixture/' },
}));

afterEach(() => vi.unstubAllEnvs());

it('renders the LinkedIn action when its URL and form endpoint are configured', async () => {
  vi.stubEnv('PUBLIC_CONTACT_FORM_ENDPOINT', 'https://contact.test/submit');
  const { default: ContactForm } = await import('../../src/components/contact/ContactForm.astro');
  const container = await AstroContainer.create();
  const html = await container.renderToString(ContactForm);

  expect(html).toContain('class="contact-form__secondary"');
  expect(html).toContain('href="https://www.linkedin.com/in/test-fixture/"');
  expect(html).toContain('Find me on LinkedIn');
});
