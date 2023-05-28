import { fixMismatchesCli } from '../../../src/bin-fix-mismatches/fix-mismatches-cli';
import { listMismatchesCli } from '../../../src/bin-list-mismatches/list-mismatches-cli';
import { listCli } from '../../../src/bin-list/list-cli';
import { mockPackage } from '../../mock';
import { createScenario } from '../lib/create-scenario';

describe('versionGroups', () => {
  describe('https://github.com/JamieMason/syncpack/issues/95 reproduction', () => {
    [
      () =>
        createScenario(
          [
            {
              path: 'packages/api/package.json',
              before: mockPackage('api', { deps: ['@pnpm-syncpack/shared@workspace:*'] }),
              after: mockPackage('api', { deps: ['@pnpm-syncpack/shared@workspace:*'] }),
            },
            {
              path: 'packages/app/package.json',
              before: mockPackage('app', { deps: ['@pnpm-syncpack/shared@workspace:*'] }),
              after: mockPackage('app', { deps: ['@pnpm-syncpack/shared@workspace:*'] }),
            },
            {
              path: 'packages/shared/package.json',
              before: mockPackage('@pnpm-syncpack/shared', {
                otherProps: { name: '@pnpm-syncpack/shared', version: '1.0.0' },
              }),
              after: mockPackage('@pnpm-syncpack/shared', {
                otherProps: { name: '@pnpm-syncpack/shared', version: '1.0.0' },
              }),
            },
          ],
          {},
        ),
    ].forEach((getScenario) => {
      describe('versionGroup.inspect()', () => {
        test('should identify as valid because "workspace:*" is allowed to mismatch the canonical package version', () => {
          const scenario = getScenario();
          expect(scenario.report.versionGroups).toEqual([
            [
              expect.objectContaining({
                isValid: true,
                name: '@pnpm-syncpack/shared',
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
            scenario.files['packages/api/package.json'].logEntryWhenUnchanged,
            scenario.files['packages/app/package.json'].logEntryWhenUnchanged,
            scenario.files['packages/shared/package.json'].logEntryWhenUnchanged,
          ]);
        });
      });

      describe('list-mismatches', () => {
        test('should exit with 1 on the mismatch', () => {
          const scenario = getScenario();
          listMismatchesCli({}, scenario.disk);
          expect(scenario.disk.process.exit).not.toHaveBeenCalled();
        });
      });

      describe('list', () => {
        test('should exit with 1 on the mismatch', () => {
          const scenario = getScenario();
          listCli({}, scenario.disk);
          expect(scenario.disk.process.exit).not.toHaveBeenCalled();
        });
      });
    });
  });
});