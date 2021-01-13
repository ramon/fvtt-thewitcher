/**
 * A standardized helper function for managing core the witcher rpg "d10 rolls"
 *
 *
 * @param {Array} terms             The dice roll component parts, excluding the initial d20
 * @param {Object} data             Actor or item data against which to parse the roll
 * @param {Event|object} event      The triggering event which initiated the roll
 * @param {string} rollMode         A specific roll mode to apply as the default for the resulting roll
 * @param {string|null} template    The HTML template used to render the roll dialog
 * @param {string|null} title       The dice roll UI window title
 * @param {Object} speaker          The ChatMessage speaker to pass when creating the chat
 * @param {string|null} flavor      Flavor text to use in the posted chat message
 * @param {Function} onClose        Callback for actions to take when the dialog form is closed
 * @param {Object} dialogOptions    Modal dialog options
 * @param {number} critical         The value of d20 result which represents a critical success
 * @param {number} fumble           The value of d20 result which represents a critical failure
 * @param {number} targetValue      Assign a target value against which the result of this roll should be compared
 * @param {boolean} chatMessage     Automatically create a Chat Message for the result of this roll
 * @param {object} messageData      Additional data which is applied to the created Chat Message, if any
 *
 * @return {Promise}                A Promise which resolves once the roll workflow has completed
 */

export async function d10Roll({
                                  terms = [],
                                  data = {},
                                  event = {},
                                  rollMode = null,
                                  template = "systems/thewitcher/templates/chat/roll.hbs",
                                  title = null,
                                  speaker = null,
                                  flavor = null,
                                  dialogOptions = {},
                                  targetValue = null,
                                  chatMessage = true,
                                  messageData = {},
                                  templateData = {
                                      roll: Roll,
                                  }
                              }) {

    // Prepare Message Data
    // @ts-ignore
    messageData.flavor = flavor || title;
    // @ts-ignore
    messageData.speaker = speaker || ChatMessage.getSpeaker();
    const messageOptions = {rollMode: rollMode || game.settings.get("core", "rollMode")};

    // Determine the d10 roll and modifiers
    let nd = 1;

    // Prepend the d10 roll
    let formula = `${nd}d10`;
    terms.unshift(formula);

    // Execute the roll
    let roll = new Roll(terms.join(" + "), data);
    try {
        // @ts-ignore
        roll.evaluate();
    } catch (err) {
        console.error(err);
        ui.notifications.error(`Dice roll evaluation failed: ${err.message}`);
        return null;
    }

    if (roll && chatMessage) await roll.toMessage(messageData, messageOptions);
    return roll;
}
