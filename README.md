# Obsidian Todo Completion Plugin

Expands `!t` into a timestamped todo marker in Obsidian.

## Behavior

In the editor, type `!t` and press `Tab` to replace it with:

```text
!TODO[YYYY-MM-DD HH:mm]
```

If the characters before the cursor are not `!t`, normal Tab behavior continues.

## Development

```bash
npm install
npm run build
```

The compiled plugin entrypoint is `main.js`.

## Install Locally

Copy or symlink this repository into an Obsidian vault at:

```text
.obsidian/plugins/todo-completion
```

Then enable the plugin in Obsidian's Community plugins settings.
