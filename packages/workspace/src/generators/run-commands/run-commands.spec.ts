import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import runCommands from './run-commands';
import { libraryGenerator } from '../library/library';
import { readProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

describe('run-commands', () => {
  it('should generate a target', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    const opts = {
      name: 'custom',
      project: 'lib',
      command: 'echo 1',
      cwd: '/packages/foo',
      outputs: 'dist/a, dist/b, dist/c',
    };

    await libraryGenerator(tree, {
      name: 'lib',
      standaloneConfig: false,
    });

    await runCommands(tree, opts);

    const customTarget = readProjectConfiguration(tree, 'lib').targets.custom;
    expect(customTarget).toEqual({
      executor: 'nx:run-commands',
      outputs: [
        '{workspaceRoot}/dist/a',
        '{workspaceRoot}/dist/b',
        '{workspaceRoot}/dist/c',
      ],
      options: {
        command: 'echo 1',
        cwd: '/packages/foo',
      },
    });
  });
});
