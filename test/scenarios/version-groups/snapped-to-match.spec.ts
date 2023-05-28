import { fixMismatchesCli } from '../../../src/bin-fix-mismatches/fix-mismatches-cli';
import { listMismatchesCli } from '../../../src/bin-list-mismatches/list-mismatches-cli';
import { listCli } from '../../../src/bin-list/list-cli';
import { mockPackage } from '../../mock';
import { createScenario } from '../lib/create-scenario';

describe('versionGroups', () => {
  describe('snapTo which already matches', () => {
    [
      () =>
        createScenario(
          [
            {
              path: 'packages/a/package.json',
              before: mockPackage('a', { otherProps: { packageManager: 'react@15.6.1' } }),
              after: mockPackage('a', { otherProps: { packageManager: 'react@15.6.1' } }),
            },
            {
              path: 'packages/b/package.json',
              before: mockPackage('b', { otherProps: { packageManager: 'react@15.6.1' } }),
              after: mockPackage('b', { otherProps: { packageManager: 'react@15.6.1' } }),
            },
            {
              path: 'packages/c/package.json',
              before: mockPackage('c', { deps: ['foo@0.1.0'] }),
              after: mockPackage('c', { deps: ['foo@0.1.0'] }),
            },
          ],
          {
            customTypes: {
              engines: {
                strategy: 'name@version',
                path: 'packageManager',
              },
            },
            versionGroups: [
              {
                dependencies: ['react'],
                packages: ['**'],
                snapTo: ['a'],
              },
            ],
          },
        ),
      () =>
        createScenario(
          [
            {
              path: 'packages/a/package.json',
              before: mockPackage('a', { otherProps: { deps: { custom: { react: '15.6.1' } } } }),
              after: mockPackage('a', { otherProps: { deps: { custom: { react: '15.6.1' } } } }),
            },
            {
              path: 'packages/b/package.json',
              before: mockPackage('b', { otherProps: { deps: { custom: { react: '15.6.1' } } } }),
              after: mockPackage('b', { otherProps: { deps: { custom: { react: '15.6.1' } } } }),
            },
            {
              path: 'packages/c/package.json',
              before: mockPackage('c', { deps: ['foo@0.1.0'] }),
              after: mockPackage('c', { deps: ['foo@0.1.0'] }),
            },
          ],
          {
            customTypes: {
              engines: {
                strategy: 'versionsByName',
                path: 'deps.custom',
              },
            },
            versionGroups: [
              {
                dependencies: ['react'],
                packages: ['**'],
                snapTo: ['a'],
              },
            ],
          },
        ),
      () =>
        createScenario(
          [
            {
              path: 'packages/a/package.json',
              before: mockPackage('a', { otherProps: { customDeps: { react: '15.6.1' } } }),
              after: mockPackage('a', { otherProps: { customDeps: { react: '15.6.1' } } }),
            },
            {
              path: 'packages/b/package.json',
              before: mockPackage('b', { otherProps: { customDeps: { react: '15.6.1' } } }),
              after: mockPackage('b', { otherProps: { customDeps: { react: '15.6.1' } } }),
            },
            {
              path: 'packages/c/package.json',
              before: mockPackage('c', { deps: ['foo@0.1.0'] }),
              after: mockPackage('c', { deps: ['foo@0.1.0'] }),
            },
          ],
          {
            customTypes: {
              engines: {
                strategy: 'version',
                path: 'customDeps.react',
              },
            },
            versionGroups: [
              {
                dependencies: ['react'],
                packages: ['**'],
                snapTo: ['a'],
              },
            ],
          },
        ),
      ...['deps', 'devDeps', 'overrides', 'peerDeps', 'pnpmOverrides', 'resolutions'].map(
        (type: string) => () =>
          createScenario(
            [
              {
                path: 'packages/a/package.json',
                before: mockPackage('a', { [type]: ['react@15.6.1'] }),
                after: mockPackage('a', { [type]: ['react@15.6.1'] }),
              },
              {
                path: 'packages/b/package.json',
                before: mockPackage('b', { [type]: ['react@15.6.1'] }),
                after: mockPackage('b', { [type]: ['react@15.6.1'] }),
              },
              {
                path: 'packages/c/package.json',
                before: mockPackage('c', { [type]: ['foo@0.1.0'] }),
                after: mockPackage('c', { [type]: ['foo@0.1.0'] }),
              },
            ],
            {
              versionGroups: [
                {
                  dependencies: ['react'],
                  packages: ['**'],
                  snapTo: ['a'],
                },
              ],
            },
          ),
      ),
    ].forEach((getScenario) => {
      describe('versionGroup.inspect()', () => {
        test('should identify as a mismatch where the version present in package "a" should be followed', () => {
          const scenario = getScenario();
          expect(scenario.report.versionGroups).toEqual([
            [
              expect.objectContaining({
                isValid: true,
                name: 'react',
                status: 'VALID',
              }),
            ],
            [
              expect.objectContaining({
                isValid: true,
                name: 'foo',
                status: 'VALID',
              }),
            ],
          ]);
        });
      });

      describe('fix-mismatches', () => {
        test('should report as valid', () => {
          const scenario = getScenario();
          fixMismatchesCli({}, scenario.disk);
          expect(scenario.disk.process.exit).not.toHaveBeenCalled();
          expect(scenario.disk.writeFileSync).not.toHaveBeenCalled();
          expect(scenario.log.mock.calls).toEqual([
            scenario.files['packages/a/package.json'].logEntryWhenUnchanged,
            scenario.files['packages/b/package.json'].logEntryWhenUnchanged,
            scenario.files['packages/c/package.json'].logEntryWhenUnchanged,
          ]);
        });
      });

      describe('list-mismatches', () => {
        test('should report as valid', () => {
          const scenario = getScenario();
          listMismatchesCli({}, scenario.disk);
          expect(scenario.disk.process.exit).not.toHaveBeenCalled();
        });
      });

      describe('list', () => {
        test('should report as valid', () => {
          const scenario = getScenario();
          listCli({}, scenario.disk);
          expect(scenario.disk.process.exit).not.toHaveBeenCalled();
        });
      });
    });
  });
});