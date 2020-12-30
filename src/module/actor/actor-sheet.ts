export default class WitcherActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["thewitcher", "sheet", "actor"],
            template: "systems/thewitcher/templates/actor/actor-sheet.hbs",
            width: 600, height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary" }]
        });
    }

    /**
     * @override
     */
    getData(): ActorSheetData<any> {
        const data = super.getData();

        return data;
    }

    protected activateListeners(html: JQuery | HTMLElement) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;
    }
}