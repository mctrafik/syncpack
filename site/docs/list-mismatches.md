---
id: list-mismatches
title: list-mismatches
---

List dependencies which are required by multiple packages, where the version is
not the same across every package.

See [`versionGroups`](./config/version-groups.md) if you have advanced
requirements.

## CLI Options

```
-s, --source [pattern]  glob pattern for package.json files to read from
-f, --filter [pattern]  only include dependencies whose name matches this regex
-c, --config <path>     path to a syncpack config file
-t, --types <names>     only include dependencies matching these types (eg. types=dev,prod,myCustomType)
-h, --help              display help for command
```

## Examples

```bash
# uses defaults for resolving packages
syncpack list-mismatches
# uses packages defined by --source when provided
syncpack list-mismatches --source "apps/*/package.json"
# multiple globs can be provided like this
syncpack list-mismatches --source "apps/*/package.json" --source "core/*/package.json"
# uses dependencies regular expression defined by --filter when provided
syncpack list-mismatches --filter "typescript|tslint"
# only inspect "devDependencies"
syncpack list-mismatches --types dev
# only inspect "devDependencies" and "peerDependencies"
syncpack list-mismatches --types dev,peer
```