import { formatCli } from '../../../src/bin-format/format-cli';
import { mockPackage } from '../../mock';
import { createScenario } from '../lib/create-scenario';

/** "scripts" object keys should be A-Z but is not */

describe('format', () => {
  it('sorts object properties alphabetically by key', () => {
    const scenario = getScenario();
    formatCli(scenario.config, scenario.disk);
    expect(scenario.disk.writeFileSync.mock.calls).toEqual([
      scenario.files['packages/a/package.json'].diskWriteWhenChanged,
    ]);
    expect(scenario.log.mock.calls).toEqual([
      scenario.files['packages/a/package.json'].logEntryWhenChanged,
    ]);
  });

  function getScenario() {
    return createScenario(
      [
        {
          path: 'packages/a/package.json',
          before: mockPackage('a', { otherProps: { scripts: { B: '', A: '' } } }),
          after: mockPackage('a', { otherProps: { scripts: { A: '', B: '' } } }),
        },
      ],
      {
        sortAz: ['scripts'],
      },
    );
  }
});