import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGithubProjects, fetchPublicGithubProjects, projectTitle } from '../lib/github-projects.ts';

afterEach(() => mock.restoreAll());
const repository = (overrides = {}) => ({ id: 1, name: 'sample', html_url: 'https://github.com/asithaisuru/sample', updated_at: '2026-01-01', ...overrides });

test('normalization filters private, forked, archived and unrelated projects', () => {
  const values = [repository(), repository({ private: true }), repository({ fork: true }), repository({ archived: true }), repository({ name: 'portfolio' }), repository({ html_url: 'https://example.test/untrusted' })];
  assert.equal(normalizeGithubProjects(values).length, 1);
});

test('optional metadata is sanitized and projects are ordered by update date', () => {
  const projects = normalizeGithubProjects([repository({ topics: [1, 'python'], homepage: 'javascript:alert(1)' }), repository({ id: 2, name: 'recent', updated_at: '2026-02-01' })]);
  assert.equal(projects[0].name, 'recent');
  assert.equal(projects[1].homepage, null);
  assert.deepEqual(projects[1].topics, ['python']);
});

test('invalid API payloads fail explicitly', () => {
  assert.throws(() => normalizeGithubProjects({ message: 'rate limited' }), /Invalid/);
});

test('API errors and rate limits are propagated for the UI fallback', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 403 }));
  await assert.rejects(fetchPublicGithubProjects(new AbortController().signal), /403/);
});

test('pagination stops after the last page and never sends server credentials', async () => {
  const calls = [];
  mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return Response.json(calls.length === 1 ? Array.from({ length: 100 }, (_, id) => repository({ id })) : [repository({ id: 101 })]);
  });
  assert.equal((await fetchPublicGithubProjects(new AbortController().signal)).length, 101);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /page=2/);
  assert.equal(calls[0].options.headers.Authorization, undefined);
});

test('project titles are readable', () => assert.equal(projectTitle('project_oasis'), 'Project Oasis'));
