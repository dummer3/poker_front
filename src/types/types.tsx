/**
 * @type - Type to represent a question
*/
export type Question_t = {
    /** Correct action */
    Action: string,
    /** value for Raise */
    R: number,
    /**   value for Raise/Call */
    RC: number,
    /**   value for Raise/Fall */
    RF: number,
    /**   value for Call */
    C: number,
    /**   value for Call/Fall */
    CF: number,
    /**   value for Fall */
    F: number,
    /**   player's hand string representation     */
    hand: string,
    /**  difficulty of this question     */
    difficulty: number,
    /**  scenario from which the question come from   */
    scenario: string,
    /** situation from which the question come from    */
    situation: string,
    /** position from which the situation come from  */
    position: string
}

/**
 * @type - Type to represent a quiz
 * @var {number} id -  
 * @var {number} difficulty -
 * @var {string} scenarios - 
 * @var {string} situations -
 * @var {string} positions - 
*/
export type Quizz_t = {
    /**id of this quiz   */
    id: number,
    /** number of question in this quiz */
    nbrQuestion: number,
    /** difficulty of this question */
    difficulty: number,
    /** list of all position the user choose */
    positions: string[],
    /** list of all situation the user choose */
    situations: string[],
    /** list of all scenario the user choose */
    scenarios: string[]
}