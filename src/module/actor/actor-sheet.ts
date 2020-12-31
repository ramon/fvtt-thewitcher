export default class WitcherActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["thewitcher", "sheet", "actor"],
            template: "systems/thewitcher/templates/actor/actor-sheet.hbs",
            width: 850, height: 600,
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

    /**
     * Activate event listeners using the prepared sheet HTML
     * @param html {JQuery | HTMLElement}   The prepared HTML object ready to be rendered into the DOM
     */

    protected activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Owner Only Listeners
        if (this.actor.owner) {
            // Ability Checks
            html.find(".ability-name").click(this._onRollAbilityTest.bind(this));
        }

    }

    /**
     * Handle ability rolls.
     *
     * @param {Event} event The originating click event
     * @private
     */
     _onRollAbilityTest(event) {
        event.preventDefault();
        let ability = event.currentTarget.parentElement.dataset.ability;
        this.actor.rollAbility(ability, {event: event});
    }
}