import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '../..');
const workflowPath = resolve(repositoryRoot, '.github/workflows/deploy.yml');

describe('GitHub Pages deployment', () => {
  it('publishes the static user site from main through separate build and deploy jobs', () => {
    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, 'utf8');

    expect(workflow).toMatch(/push:\s*\n\s*branches:\s*\[main\]/);
    expect(workflow).toMatch(/workflow_dispatch:/);
    expect(workflow).toMatch(/contents:\s*read/);
    expect(workflow).toMatch(/pages:\s*write/);
    expect(workflow).toMatch(/id-token:\s*write/);
    expect(workflow).toMatch(/concurrency:\s*\n\s*group:\s*pages\s*\n\s*cancel-in-progress:\s*true/);
    expect(workflow).toMatch(/jobs:\s*\n\s*build:/);
    expect(workflow).toMatch(/uses:\s*actions\/checkout@v7/);
    expect(workflow).toMatch(/uses:\s*withastro\/action@v6/);
    expect(workflow).toMatch(
      /PUBLIC_CONTACT_FORM_ENDPOINT:\s*\$\{\{\s*vars\.PUBLIC_CONTACT_FORM_ENDPOINT\s*\}\}/,
    );
    expect(workflow).toMatch(/deploy:\s*\n\s*needs:\s*build/);
    expect(workflow).toMatch(/name:\s*github-pages/);
    expect(workflow).toMatch(/url:\s*\$\{\{ steps\.deployment\.outputs\.page_url \}\}/);
    expect(workflow).toMatch(/uses:\s*actions\/deploy-pages@v5/);
  });
});
