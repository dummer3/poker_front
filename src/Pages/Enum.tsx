/**
 * Value enum for the value of a card.
 * @readonly
 * @private
 * @enum {number}
 */

export enum VALUE {
    _2 = 1,
    _3 = 2,
    _4 = 3,
    _5 = 4,
    _6 = 5,
    _7 = 6,
    _8 = 7,
    _9 = 8,
    T = 9,
    J = 10,
    Q = 11,
    K = 12,
    A = 0
}

/**
 * Value enum for the suit of a card.
 * @readonly
 * @private
 * @enum {number}
 */
export enum SUIT {
    CLUB = 0,
    DIAMOND = 1,
    HEART = 2,
    SPADES = 3
}


/**
 * Action enum for the basic user action.
 * @readonly
 * @enum {string}
 */
export enum ACTION {
    FOLD = "FOLD",
    CALL = "CALL",
    RAISE = "RAISE",
}

/**
 * Multiple_action enum for complex user action.
 * @readonly
 * @enum {string} 
 */
export enum MULTIPLE_ACTION {

    "CALL/FOLD" = "CALL/FOLD",
    "RAISE/CALL" = "RAISE/CALL",
    "RAISE/FOLD" = "RAISE/FOLD"
}


/**
 * Position enum for the player position.
 * @readonly
 * @private
 * @enum {number}
 */
export enum POSITION {
    SB = 0,
    BB = 1,
    UTG = 2,
    HJ = 3,
    CO = 4,
    BTN = 5
}