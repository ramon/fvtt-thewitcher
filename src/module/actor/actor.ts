/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
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

        let physicalBase = Math.floor((this._getAbilityValue("body")+this._getAbilityValue("will"))/2);
        let body = this._getAbilityValue("body");

        data.attributes.hp.max = physicalBase*5;
        data.attributes.sta.max = physicalBase*5;
        data.attributes.rec.value = physicalBase;
        data.attributes.stun.max = physicalBase*10;

        data.attributes.run.max = this._getAbilityValue("spd")*3;
        data.attributes.leap.max = Math.floor((this._getAbilityValue("spd")*3)/5);
        data.attributes.enc.value = body*10;
    }

    private _getAbilityValue(ability: string) : number {
        const actorData = this.data;
        const data = actorData.data;
        const abilityData = data.abilities[ability];

        if (abilityData.temp != null) {
            return abilityData.temp;
        }

        return abilityData.value;
    }
}