import {
	App,
	MarkdownPostProcessorContext,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { highlightDQL } from "./dql-highlight";

export interface DQLSyntaxSettings {
	clickToEditEnabled: boolean;
	showCopyButton: boolean;
	fontSize: string;
}

export const DEFAULT_SETTINGS: DQLSyntaxSettings = {
	clickToEditEnabled: true,
	showCopyButton: true,
	fontSize: "0.9em",
};

export default class DQLSyntaxPlugin extends Plugin {
	settings!: DQLSyntaxSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new DQLSyntaxSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor("dql", (source, el, ctx) => {
			el.innerHTML = "";
			const block = highlightDQL(source, "DQL", {
				showCopyButton: this.settings.showCopyButton,
				fontSize: this.settings.fontSize,
			});

			if (this.settings.clickToEditEnabled) {
				this.addClickToEdit(block, el, ctx);
			}

			el.appendChild(block);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
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

class DQLSyntaxSettingTab extends PluginSettingTab {
	plugin: DQLSyntaxPlugin;

	constructor(app: App, plugin: DQLSyntaxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Click-to-edit")
			.setDesc(
				"Click a highlighted DQL block to jump to its source in the editor."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.clickToEditEnabled)
					.onChange(async (value) => {
						this.plugin.settings.clickToEditEnabled = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show copy button")
			.setDesc(
				"Display a copy button when hovering over a DQL block."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showCopyButton)
					.onChange(async (value) => {
						this.plugin.settings.showCopyButton = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Font size")
			.setDesc("Font size for DQL code blocks.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("0.7em", "Small")
					.addOption("0.8em", "Default \u2212")
					.addOption("0.9em", "Default")
					.addOption("1.0em", "Default +")
					.addOption("1.1em", "Large")
					.addOption("1.2em", "X-Large")
					.setValue(this.plugin.settings.fontSize)
					.onChange(async (value) => {
						this.plugin.settings.fontSize = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
