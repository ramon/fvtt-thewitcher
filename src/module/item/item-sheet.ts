export default class WitcherItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 560, height: 400,
            classes: ["thewitcher", "sheet", "item"],
            resizable: true,
            scrollY: [".tab.details"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description"}]
        })
    }

    /** @override */
    get template() {
        const path = "systems/thewitcher/templates/item";

        if (["service", "general_gear", "food_and_drink"].includes(this.item.data.type)) {
            return `${path}/general.hbs`;
        }

        return `${path}${this.item.data.type}.hbs`;
    }

    /** @override */
    // @ts-ignore-start Property_0_does_not_exist_on_type_1
    getData(options) {
        // @ts-ignore
        const data = super.getData(options);

        // @ts-ignore
        data.config = CONFIG.WITCHER;

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

        return data;
    }

    private static getItemStatus(item): void {
        if (["service", "general"].includes(item.type)) return;
    }

    private static getItemProperties(item) {
        const props = [];

        return props.filter(p => !!p);
    }
}