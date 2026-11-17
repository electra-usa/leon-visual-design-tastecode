import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { initCheckout } from './workspace-git.js'

const temporary: string[] = []

afterEach(async () => {
  vi.unstubAllEnvs()
  await Promise.all(
    temporary
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true, maxRetries: 5 })),
  )
})

async function folder(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'tastecode-init-'))
  temporary.push(directory)
  return directory
}

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 'test@example.com',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 'test@example.com',
    },
  }).trim()
}

const identity = {
  GIT_AUTHOR_NAME: 'Test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'Test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
}

describe('initCheckout', () => {
  it('makes a plain folder a repository with one starting-point commit', async () => {
    for (const [key, value] of Object.entries(identity)) vi.stubEnv(key, value)
    const cwd = await folder()
    await writeFile(path.join(cwd, 'index.html'), '<h1>hi</h1>')

    await initCheckout(cwd)

    expect(git(cwd, ['symbolic-ref', '--short', 'HEAD'])).toBe('main')
    expect(git(cwd, ['log', '--format=%s'])).toBe('Starting point')
    expect(git(cwd, ['ls-files']).split('\n').sort()).toEqual(['.gitignore', 'index.html'])
    expect(await readFile(path.join(cwd, '.gitignore'), 'utf8')).toContain('node_modules/')
  })

  it('keeps an existing .gitignore and honours it', async () => {
    for (const [key, value] of Object.entries(identity)) vi.stubEnv(key, value)
    const cwd = await folder()
    await writeFile(path.join(cwd, '.gitignore'), 'secret.txt\n')
    await writeFile(path.join(cwd, 'secret.txt'), 'x')

    await initCheckout(cwd)

    expect(await readFile(path.join(cwd, '.gitignore'), 'utf8')).toBe('secret.txt\n')
    expect(git(cwd, ['ls-files'])).toBe('.gitignore')
  })

  it('refuses a folder that already uses Git', async () => {
    for (const [key, value] of Object.entries(identity)) vi.stubEnv(key, value)
    const cwd = await folder()
    git(cwd, ['init', '--quiet'])

    await expect(initCheckout(cwd)).rejects.toThrow('already uses Git')
  })
})
