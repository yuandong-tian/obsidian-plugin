import { Plugin } from "obsidian";
import { Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";

export default class TodoCompletionPlugin extends Plugin {
  async onload() {
    const triggers = [
      { trigger: "!todo", marker: "TODO" },
      { trigger: "!done", marker: "DONE" },
      { trigger: "!t", marker: "TODO" },
      { trigger: "!d", marker: "DONE" },
    ];

    const expandMarker = (view: EditorView) => {
      const { state } = view;
      const pos = state.selection.main.head;

      const match = triggers.find(({ trigger }) => {
        return state.doc.sliceString(Math.max(0, pos - trigger.length), pos) === trigger;
      });

      if (match === undefined) {
        return false; // let normal Tab behavior continue
      }

      const timestamp = window.moment().format("YYYY-MM-DD HH:mm");
      const replacement = `!${match.marker}[${timestamp}] `;

      view.dispatch({
        changes: {
          from: pos - match.trigger.length,
          to: pos,
          insert: replacement,
        },
        selection: {
          anchor: pos - match.trigger.length + replacement.length,
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
