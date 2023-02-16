---
id: source
title: --source
---

Override your [`source`](../config/source.md) configuration on an ad hoc basis.

This can be useful when you only want to deal with one package at a single time,
to list all of the devDependencies in one package for example:

```
syncpack list --types dev --source "packages/threepwood"
```

Patterns supported by [glob](https://github.com/isaacs/node-glob) can be used:

```
syncpack list-mismatches --source "packages/beta-*"
```

Multiple values can be provided:

```
syncpack list-mismatches --source "packages/api-server" --source "packages/api-client"
```

:::tip

Absolute paths, relative paths, and glob patterns are all supported – and any
combination of them can be used together.

:::