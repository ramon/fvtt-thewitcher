export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "systems/thewitcher/templates"
		"systems/thewitcher/templates/actor/parts/sheet-header.hbs"
	];

	return loadTemplates(templatePaths);
}
