import CONSTANTS from "./utilities/constants.js"
import PromptSync from "prompt-sync"

/**
 * @class
 */
const Prompt = class {
  /**
   * @public
   */
  constructor() {
    /**
     * Mutable array of strings to be returned
     * @var { string[] } inputs
     */
    this.inputs = []

    /**
     * Method to interact with a user via the CLI
     * @const { PromptSync.Prompt }
     */
    this.prompt = PromptSync({ sigint: true })

    /**
     * Input by the user
     * @var { string[] } input
     */
    this.input = [""]

    /**
     * Input from the user to be added to _keywords
     * @var { string|string[] } add
     */
    this.add = ""

    /**
     * Number of keywords added to the array in this iteration
     * @var { number } added
     */
    this.added = 0

    /**
     * Number of keywords not added to the array in this iteration
     * @var { number } voided
     */
    this.voided = 0

    /**
     * Total current number of inputs through every iteration so far
     * @var { number } total
     */
    this.total = 0
  }

  /**
   * Prompt for keywords
   * @method
   * @public
   * @return { string[] } Keyword array
   */
  keywords = () => {
    this._prompt()
    return this.input
  }

  /**
   * Recursively prompt users in the CLI
   * @method
   * @private
   * @return { void }
   */
  _prompt = () => {
    do {
      console.log(
        CONSTANTS.COLORS.BLUE,
        this.inputs.length
          ? CONSTANTS.ENTER_ANOTHER_KEYWORD
          : CONSTANTS.ENTER_KEYWORD,
        CONSTANTS.COLORS.RESET
      )

      this.input = this.prompt()
        .split(",")
        .map((_input) => _input.trim())

      this.add = this.input.filter(
        (_input) => _input && !this.inputs.includes(_input)
      )

      this.added = this.add.length
      this.voided =
        !this.input.length && !this.add.length
          ? 0
          : this.input.length - this.added
      this.inputs = [...this.inputs, ...this.add]
      this.total = this.inputs.length

      console.log(
        CONSTANTS.COLORS.GREEN,
        CONSTANTS.KEYWORDS_ADDED(this.added),
        CONSTANTS.COLORS.RED,
        CONSTANTS.KEYWORDS_VOIDED(this.voided),
        CONSTANTS.COLORS.GREEN,
        CONSTANTS.KEYWORDS_TOTAL(this.total),
        CONSTANTS.COLORS.RESET
      )
    } while (this.input.join(""))
  }
}

export default Prompt
