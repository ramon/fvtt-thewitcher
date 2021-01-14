export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "systems/thewitcher/templates"

		// Actor
		"systems/thewitcher/templates/actor/parts/header.hbs",
		"systems/thewitcher/templates/actor/parts/npc-header.hbs",
		"systems/thewitcher/templates/actor/parts/skills.hbs",
		"systems/thewitcher/templates/actor/parts/skill-list.hbs",
		"systems/thewitcher/templates/actor/parts/professions.hbs",
		"systems/thewitcher/templates/actor/parts/gears_and_inventory.hbs",

		// Items
		"systems/thewitcher/templates/item/parts/description.hbs",
		"systems/thewitcher/templates/item/parts/summary.hbs",
	];

	return loadTemplates(templatePaths);
}
