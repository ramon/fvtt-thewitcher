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
        if (actorData.type === "npc") this._prepareNPCData(actorData);
    }

    private _prepareCharacterData(actorData: ActorData<any>) {
        const data = actorData.data;

        // Prepare derived abilities
        this._prepareDerivedAbilities(actorData)
        this._prepareSkills(actorData)

        // Calc Total Ability points
        data.abilities_points = Object.values(data.abilities).reduce((t, {value}) => t + value, 0)

        // TODO: Calc Total skills points

        // Enable/Disable Verbal Combat Optional Rule
        data.attributes.resolve.disabled = !game.settings.get("thewitcher", "verbalCombat");
    }

    private _prepareNPCData(actorData: ActorData<any>) {
        const data = actorData.data;

        // Prepare derived abilities
        this._prepareDerivedAbilities(actorData, true)
        this._prepareSkills(actorData)
    }

    private _prepareDerivedAbilities(actorData: ActorData<any>, npc: Boolean = false) {
        const data = actorData.data;
        const flags = actorData.flags.thewitcher || {};

        let physicalBase = Math.floor((this._getAbilityValue("body") + this._getAbilityValue("will")) / 2);
        let body = this._getAbilityValue("body");

        // set the calculated init as an ref property
        data.abilities.ref.init = this._getAbilityValue("ref");

        data.attributes.hp.max = physicalBase * 5;
        data.attributes.sta.max = physicalBase * 5;
        data.attributes.rec.value = physicalBase;
        data.attributes.stun.max = physicalBase * 10;

        data.attributes.run.max = this._getAbilityValue("spd") * 3;
        data.attributes.leap.max = Math.floor((this._getAbilityValue("spd") * 3) / 5);
        data.attributes.enc.value = body * 10;
        data.attributes.resolve.value = Math.floor(((this._getAbilityValue("spd") + this._getAbilityValue("int")) / 2) * 5);

        if (!npc) {
            data.attributes.wound_threshold = {
                "value": physicalBase,
                "label": "THEWITCHER.actor_sheet.wound_threshold",
                "abbr": "THEWITCHER.actor_sheet.wound_threshold",
                "not_editable": true
            };

            let bmdBody = body;
            if ((body % 2)) bmdBody = body + 1;
            data.attributes.bonus_melee_damage = {
                "value": -6 + bmdBody,
                "label": "THEWITCHER.actor_sheet.bonus_melee_damage",
                "abbr": "THEWITCHER.actor_sheet.bonus_melee_damage",
                "not_editable": true
            }
        }
    }

    private _prepareSkills(actorData: ActorData<any>) {
        const data = actorData.data;
        const flags = actorData.flags.thewitcher || {};

        Object.entries(data.skills).forEach(([abilityId, skills]) => {
            const abilityValue = this._getAbilityValue(abilityId);

            Object.values(skills).forEach((skill) => {
                skill.abilityId = abilityId;
                skill.total = skill.value + abilityValue;
            });
        });
    }

    private _getAbilityValue(abilityId: string): number {
        const actorData = this.data;
        const data = actorData.data;
        const abilityData = data.abilities[abilityId];

        if (abilityData.temp != null && abilityData.temp > 0) {
            return abilityData.temp;
        }

        return abilityData.value;
    }

    private _getSkillValue(abilityId, skillId: string, total = false): number {
        const actorData = this.data;
        const data = actorData.data;
        const skillData = data.skills[abilityId][skillId];

        if (total) return skillData.total;
        return skillData.value;
    }

    /**
     * Roll a Ability test.
     * @param {String} abilityId    The ability id (e.g. "int")
     * @param options               Options which configure how ability tests are rolled
     */
    rollAbility(abilityId: string, options: object = {}, templateData = {}) {
        const label = game.i18n.localize(`THEWITCHER.actor.abilities.${abilityId}.label`);
        const abilityValue = this._getAbilityValue(abilityId);

        const terms = ["@ability"];
        const data = {ability: abilityValue}

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

    /**
     * Roll a Skill test.
     * @param {String} abilityId    The ability id (e.g. "int")
     * @param {String} skillId    The ability id (e.g. "business")
     * @param options               Options which configure how ability tests are rolled
     */
    rollSkill(abilityId: string, skillId: string, options: object = {}, templateData = {}) {
        const label = game.i18n.localize(`THEWITCHER.actor.skills.${skillId}`);
        const abilityValue = this._getAbilityValue(abilityId);
        const skillValue = this._getSkillValue(abilityId, skillId);

        const terms = ["@ability + @base"];
        const data = {ability: abilityValue, base: skillValue}

        const rollData = mergeObject(options, {
            terms: terms,
            data: data,
            title: game.i18n.format("THEWITCHER.rolls.skill_prompt_title", {skill: label}),
            messageData: {"flags.thewitcher.roll": {type: "skill", abilityValue, skillValue}}
        });
        // @ts-ignore
        rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
        return d10Roll(rollData);
    }


    /* -------------------------------------------- */
    /*  Socket Listeners and Handlers
    /* -------------------------------------------- */
    static async create(data, options={}) {
        data.token = data.token || {};
        if (data.type === "character") {
            mergeObject(data.token, {
                vision: true,
                dimSight: 30,
                sightAngle: 180,
                brightSight: 0,
                actorLink: true,
                displayName: 30,
                disposition: 1,
                displayBars: 20,
                bar1: { attribute: "attributes.hp" },
                bar2: { attribute: "attributes.stun" }
            }, {overwrite: false})
        }
        return super.create(data, options)
    }
}