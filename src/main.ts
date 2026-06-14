import { Plugin } from "obsidian";
import { Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";

export default class TodoCompletionPlugin extends Plugin {
  async onload() {
    const expandMarker = (view: EditorView) => {
      const { state } = view;
      const pos = state.selection.main.head;

      const trigger = state.doc.sliceString(Math.max(0, pos - 2), pos);
      const marker = trigger === "!t" ? "TODO" : trigger === "!d" ? "DONE" : null;

      if (marker === null) {
        return false; // let normal Tab behavior continue
      }

      const timestamp = window.moment().format("YYYY-MM-DD HH:mm");
      const replacement = `!${marker}[${timestamp}] `;

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

      return true; // handled
    };

    this.registerEditorExtension([
      Prec.highest(
        EditorView.domEventHandlers({
          keydown: (event, view) => {
            if (event.key !== "Tab" || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
              return false;
            }

            if (!expandMarker(view)) {
              return false;
            }

            event.preventDefault();
            event.stopPropagation();
            return true;
          },
        }),
      ),
      Prec.highest(
        keymap.of([
          {
            key: "Tab",
            run: expandMarker,
          },
        ]),
      ),
    ]);
  }
}
