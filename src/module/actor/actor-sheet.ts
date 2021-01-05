export default class WitcherActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["thewitcher", "sheet", "actor"],
            template: "systems/thewitcher/templates/actor/actor-sheet.hbs",
            width: 850, height: 700,
            resizable: true,
            scrollY: [
                ".tab-skills",
                ".tab-professions"
            ],
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary"}]
        });
    }

    /**
     * @override
     */
    getData(): ActorSheetData<any> {
        let data = mergeObject(super.getData(), {
            // @ts-ignore
            config: CONFIG.THEWITCHER
        });

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
            html.find(".skill-name, .skill-field.rollable").click(this._onRollSkillTest.bind(this));
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

    /**
     * Handle ability rolls.
     *
     * @param {Event} event The originating click event
     * @private
     */
    _onRollSkillTest(event) {
        event.preventDefault();
        let abilityId = event.currentTarget.parentElement.dataset.abilityId;
        let skillId = event.currentTarget.parentElement.dataset.skillId
        this.actor.rollSkill(abilityId, skillId, {event: event});
    }
}