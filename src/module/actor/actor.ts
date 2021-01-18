/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
import {d10Roll} from "../dice.js";

export default class WitcherActor extends Actor {
    /** @override */
    private prepareBaseData() {
    }

    /** @override */
    private prepareDerivedData() {
        if (this.data.type === "character") this._prepareCharacterData(this.data);
        else if (this.data.type === "npc") this._prepareNPCData(this.data);
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
        data.attributes.stun.value = Math.min(physicalBase, 10);

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

    private _getAbilityValue(abilityId:string): number {
        const abilityData = getProperty(this.data, `data.abilities.${abilityId}`);

        if (abilityData.temp != null && abilityData.temp > 0) {
            return abilityData.temp;
        }

        return abilityData.value;
    }

    private _getSkillValue(abilityId:string, skillId:string, with_ability:boolean = false): number {
        const skillData = getProperty(this.data, `data.skills.${abilityId}.${skillId}`);

        if (with_ability) return skillData.total;
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

    /**
     * Roll a Profession Skill test.
     * @param {String} abilityId    The ability id (e.g. "int")
     * @param {number} treeId      The skill tree key.
     * @param {String} skillId      The ability id (e.g. "business")
     * @param {boolean} main        True if the is the main profession skill
     * @param options               Options which configure how ability tests are rolled
     * @param templateData
     */
    rollProfessionSkill(main:boolean, treeId:number = null, skillId:string = null, options: object = {}, templateData = {}) {
        let skill = getProperty(this.data, `data.profession.main`)

        if (!main) {
            skill = getProperty(this.data, `data.profession.tree.${treeId}.chain.${skillId}`)
        }

        const label = skill.name;
        const abilityValue = this._getAbilityValue(skill.ability);
        const skillValue = skill.level;

        const terms = ["@ability + @professionLevel"];
        const data = {ability: abilityValue, professionLevel: skillValue}

        const rollData = mergeObject(options, {
            terms: terms,
            data: data,
            title: game.i18n.format("THEWITCHER.rolls.profession_skill_prompt_title", {skill: label}),
            messageData: {"flags.thewitcher.roll": {type: "profession_skill", skill, abilityValue, skillValue}}
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