/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your system
 */

// Import TypeScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import WitcherActor from "./module/actor/actor.js";
import WitcherItem from "./module/item/item.js";
import WitcherActorSheet from "./module/actor/actor-sheet.js";
import WitcherItemSheet from "./module/item/item-sheet.js";
import {WitcherDie} from "./module/die.js";
import {THEWITCHER} from "./module/config.js";

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log('thewitcher | Initializing thewitcher');

	game.thewitcher = {
		config: THEWITCHER,
		entities: {
			WitcherActor,
			WitcherItem
		}
	}

	CONFIG.THEWITCHER = THEWITCHER;

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	// @ts-ignore
	CONFIG.Combat.initiative.formula = "1d10+@abilities.ref.init";

	// Define custom Entity classes. This will override the default Actor and
	// Item classes to instead use our extended versions.
	CONFIG.Actor.entityClass = WitcherActor;
	CONFIG.Item.entityClass = WitcherItem;

	// Register sheet application classes. This will stop using the core sheets and
	// instead use our customized versions.
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("thewitcher", WitcherActorSheet, { makeDefault: true });
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("thewitcher", WitcherItemSheet, { makeDefault: true });

	// Register The Witcher RPG Die
	CONFIG.Dice.types.unshift(WitcherDie);
	CONFIG.Dice.terms["w"] = WitcherDie;
	
	// Register custom system settings
	registerSettings();
	
	// Preload Handlebars templates
	await preloadTemplates();

	Handlebars.registerHelper('localizeAbility', (abilityId) => game.i18n.localize(`THEWITCHER.actor.abilities.${abilityId}.label`));
	Handlebars.registerHelper('localizeAvailability', (avail) => game.i18n.localize(`THEWITCHER.item_sheet.availability.${avail}`));
	Handlebars.registerHelper("isResource", (data) => data.hasOwnProperty("max"));
	Handlebars.registerHelper("getAbilitySkills", (data, abilityId) => data.skills.get(abilityId))
	Handlebars.registerHelper("checkboxMultiple", (name, choices, options) => {
		const localize = options.hash['localize'] ?? false;
		let selected = options.hash['selected'] ?? null;
		selected = Object.entries(selected).map(([k, v]) => {
			if (v) {
				return String(k)
			}
		});
		console.log('selected', selected)

		// Create an option
		const option = (key, label, index) => {
			if ( localize ) label = game.i18n.localize(label);
			let isSelected = selected.includes(key);
			html += `<label class="checkbox ${isSelected ? "checked" : ""}">${label} <input type="checkbox" name="${name}.${key}" ${isSelected ? "checked" : ""} /></label>`;
		}

		// Create the options
		let html = "";
		Object.entries(choices).forEach((e, i) => option(...e, i));
		return new Handlebars.SafeString(html);
	});
});

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once('setup', function() {
	// Do anything after initialization but before
	// ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function() {
	// Do anything once the system is ready
});

// Add any additional hooks if necessary
