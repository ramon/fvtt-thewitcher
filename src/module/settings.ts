export const registerSettings = function() {
	// Register any custom system settings here
    game.settings.register("thewitcher", "systemMigrationVersion", {
        name: "System Migration Version",
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    /**
     * Register Verbal Combat Support
     */
    game.settings.register("thewitcher", "verbalCombat", {
        name: "Enable Verbal Combat",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    })
}
