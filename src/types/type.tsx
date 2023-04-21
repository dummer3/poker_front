export type Question_t = {
    Action: string,
    R: number,
    RC: number,
    RF: number,
    C: number,
    CF: number,
    F: number,
    hand: string,
    difficulty: number
}

export type Quizz_t = {
    id: number,
    nbrQuestion: number,
    difficulty: number,
    position: string[],
    scenario: string[]
}