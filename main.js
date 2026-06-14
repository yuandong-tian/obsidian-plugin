const { Plugin } = require("obsidian");
const { keymap } = require("@codemirror/view");

module.exports = class TodoCompletionPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension([
      keymap.of([
        {
          key: "Tab",
          run: (view) => {
            const { state } = view;
            const pos = state.selection.main.head;

            const before = state.doc.sliceString(Math.max(0, pos - 2), pos);

            if (before !== "!t") {
              return false;
            }

            const timestamp = window.moment().format("YYYY-MM-DD HH:mm");
            const replacement = `!TODO[${timestamp}]`;

            view.dispatch({
              changes: {
                from: pos - 2,
                to: pos,
                insert: replacement,
              },
              selection: {
                anchor: pos - 2 + replacement.length,
              },
            });

            return true;
          },
        },
      ]),
    ]);
  }
};
