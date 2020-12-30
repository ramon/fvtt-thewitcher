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

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log('thewitcher | Initializing thewitcher');

	game.thewitcher = {
		WitcherActor,
		WitcherItem
	}

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
		formula: "1d10",
		decimals: 2
	};

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

	// Assign custom classes and constants here

	
	// Register custom system settings
	registerSettings();
	
	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
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
