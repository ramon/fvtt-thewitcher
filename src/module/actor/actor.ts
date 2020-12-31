/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
import {d10Roll} from "../dice.js";

export default class WitcherActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags.thewitcher || {};

        if (actorData.type === "character") this._prepareCharacterData(actorData);
    }

    private _prepareCharacterData(actorData: ActorData<any>) {
        const data = actorData.data;

        // Prepare derived abilities
        this._prepareDerivedAbilities(actorData)

        // Calc Total Ability points
        data.abilities_points = Object.values(data.abilities).reduce((t, {value}) => t + value, 0)

        // Enable/Disable Verbal Combat Optional Rule
        data.attributes.resolve.disabled = !game.settings.get("thewitcher", "verbalCombat");
    }

    private _prepareDerivedAbilities(actorData: ActorData<any>) {
        const data = actorData.data;
        const flags = actorData.flags.thewitcher || {};

        let physicalBase = Math.floor((this._getAbilityValue("body") + this._getAbilityValue("will")) / 2);
        let body = this._getAbilityValue("body");

        data.attributes.hp.max = physicalBase * 5;
        data.attributes.sta.max = physicalBase * 5;
        data.attributes.rec.value = physicalBase;
        data.attributes.stun.max = physicalBase * 10;

        data.attributes.run.max = this._getAbilityValue("spd") * 3;
        data.attributes.leap.max = Math.floor((this._getAbilityValue("spd") * 3) / 5);
        data.attributes.enc.value = body * 10;

        data.attributes.wound_threshold = physicalBase;
    }

    private _getAbilityValue(abilityId: string): number {
        const actorData = this.data;
        const data = actorData.data;
        const abilityData = data.abilities[abilityId];

        if (abilityData.temp != null || abilityData.temp > 0) {
            return abilityData.temp;
        }

        return abilityData.value;
    }

    /**
     * Roll a Ability test.
     * @param {String} abilityId    The ability id (e.g. "int")
     * @param options               Options which configure how ability tests are rolled
     */
    rollAbility(abilityId: string, options : object = {}, templateData = {}) {
        const label = game.i18n.localize(`THEWITCHER.actor.abilities.${abilityId}.label`);
        const abilityValue = this._getAbilityValue(abilityId);

        const terms = ["@mod"];
        const data = {mod: abilityValue}

        const rollData = mergeObject(options, {
            terms: terms,
            data: data,
            title: game.i18n.format("THEWITCHER.rolls.ability_prompt_title", {ability: label}),
            messageData: {"flags.thewitcher.roll": {type: "ability", abilityId}}
        });
        // @ts-ignore
        rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
        return d10Roll(rollData);
    }
}