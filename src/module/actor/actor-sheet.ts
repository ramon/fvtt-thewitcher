import {prepareActiveEffectsCategories} from "../effects.js";

export default class WitcherActorSheet extends ActorSheet {
    private _filters: { features: Set<any>; effects: Set<any>; inventory: Set<any>; spells: Set<any>; };

    constructor(...args) {
        super(...args);

        this._filters = {
            inventory: new Set(),
            spells: new Set(),
            features: new Set(),
            effects: new Set()
        };
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["thewitcher", "sheet", "actor"],
            template: "systems/thewitcher/templates/actor/character-sheet.hbs",
            width: 850, height: 700,
            resizable: true,
            scrollY: [
                ".tab-skills",
                ".tab-profession"
            ],
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary"}]
        });
    }

    get template(): string {
        if ( !game.user.isGM && this.actor.limited ) return "systems/dnd5e/templates/actors/limited-sheet.hbs";
        return `systems/thewitcher/templates/actor/${this.actor.data.type}-sheet.hbs`;
    }

    /**
     * @override
     */
    getData(): ActorSheetData<any> {
        let data = mergeObject(super.getData(), {
            // @ts-ignore
            isCharacter: this.entity.data.type === "character",
            isNPC: this.entity.data.type === "npc",
            config: CONFIG.THEWITCHER
        });

        // @ts-ignore
        data.effects = prepareActiveEffectsCategories(this.entity.effects)

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
            html.find(".profession-skill .profession-roll").click(this._onRollProfessionalSkillTest.bind(this));
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

    /**
     * Handle professional skills rolls.
     *
     * @param {Event} event The originating click event
     * @private
     */
    _onRollProfessionalSkillTest(event) {
        event.preventDefault();
        const tree = event.currentTarget.dataset.tree;
        const skillId = event.currentTarget.dataset.skillId;
        this.actor.rollProfessionSkill((tree === "main"), tree, skillId, {event: event});
    }
}