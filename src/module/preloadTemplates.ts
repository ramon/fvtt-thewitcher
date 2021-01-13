export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "systems/thewitcher/templates"

		"systems/thewitcher/templates/actor/parts/sheet-header.hbs",
		"systems/thewitcher/templates/actor/parts/sheet-npc-header.hbs",
		"systems/thewitcher/templates/actor/parts/actor-skills.hbs",
		"systems/thewitcher/templates/actor/parts/actor-skill-list-table.hbs",
		"systems/thewitcher/templates/actor/parts/actor-professions.hbs"
	];

	return loadTemplates(templatePaths);
}
