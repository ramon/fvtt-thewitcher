const SIMPLE_ITEMS = ["service", "general_gear", "food_and_drink", "rune", "glyph", "blade_oil", "decoction"]
const EXTENDED_ITEMS = ["container", "alchemical_item", "tool_kit", "blade_oil"]
const COMPONENT_ITEMS = ["component", "substance"]

export default class WitcherItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 560, height: 500,
            classes: ["thewitcher", "sheet", "item"],
            resizable: true,
            scrollY: [".tab.details"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description"}]
        })
    }

    /** @override */
    get template() {
        const path = "systems/thewitcher/templates/item";

        if (SIMPLE_ITEMS.includes(this.item.data.type)) {
            return `${path}/general.hbs`;
        }
        else if (EXTENDED_ITEMS.includes(this.item.data.type)) {
            return `${path}/extended.hbs`;
        }
        else if (COMPONENT_ITEMS.includes(this.item.data.type)) {
            return `${path}/component.hbs`;
        }
        else return `${path}/${this.item.data.type}.hbs`;
    }

    /** @override */
    // @ts-ignore-start Property_0_does_not_exist_on_type_1
    getData(options) {
        // @ts-ignore
        const data = super.getData(options);

        // @ts-ignore
        data.config = CONFIG.THEWITCHER;

        // Item Type, Status and Details
        // @ts-ignore
        data.itemType = game.i18n.localize(`THEWITCHER.item.type.${data.item.type}`);
        // @ts-ignore
        data.itemStatus = WitcherItemSheet.getItemStatus(data.item);
        // @ts-ignore
        data.itemProperties = WitcherItemSheet.getItemProperties(data.item)
        // @ts-ignore
        data.isPhysical = data.item.data.hasOwnProperty("quantity")
        // @ts-ignore
        data.isConcealable = data.item.data.hasOwnProperty("concealment")
        // @ts-ignore
        data.isContainer = data.item.data.hasOwnProperty("items")
        // @ts-ignore
        data.hasEffect = data.item.data.hasOwnProperty("effect")
        // @ts-ignore
        data.hasRarity = data.item.data.hasOwnProperty("availability")

        return data;
    }

    private static getItemStatus(item): void {
        if (["service", "general_gear", "food_and_drink"].includes(item.type)) return;
    }

    private static getItemProperties(item) {
        const props = [];

        if (item.data.hasOwnProperty("concealment") && item.data.concealment) {
            props.push(game.i18n.localize(`THEWITCHER.item_sheet.concealment.${item.data.concealment}`))
        }

        return props.filter(p => !!p);
    }
}