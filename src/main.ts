import { MarkdownPostProcessorContext, MarkdownView, Plugin } from "obsidian";
import { highlightDQL } from "./dql-highlight";

export default class DQLSyntaxPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("dql", (source, el, ctx) => {
			el.innerHTML = "";
			const block = highlightDQL(source, "DQL");
			this.addClickToEdit(block, el, ctx);
			el.appendChild(block);
		});
	}

	private addClickToEdit(
		block: HTMLElement,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	) {
		block.addEventListener("click", (e: MouseEvent) => {
			if ((e.target as HTMLElement).closest(".dql-copy-btn")) return;

			const info = ctx.getSectionInfo(el);
			if (!info) return;

			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) return;

			view.editor.setCursor({ line: info.lineStart + 1, ch: 0 });
			view.editor.focus();
		});
	}

	onunload() {}
}
