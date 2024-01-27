# API Reference

Here are the reference for the Creators’ API framework.

Accessing the framework:

```javascript
import creator from "./path/to/framework.js";
```

Globally (requires the framework to be loaded first):

```javascript
// just use the `creator` namespace
creator;
```

## Exports

The framework exports the following:

- [`config`](./config) - Settings of the framework
- [`util`](./util) - Some utilities
- [`plugins`](./plugins) - Plugins integration

And haves the following modules:

- [`events`](./events) - Scripts communicator

Constants:

`version`
:   [`creator.plugins.Version`](./plugins#Version) instance of the
    version of the framework.

Also this default export are itself.
