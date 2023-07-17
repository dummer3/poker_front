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

export const ScenarioRepresentation = (scenario: string) => {
    let maxValue = 1;
    const bets = [{ position: POSITION.SB, bet: 0.5 }, { position: POSITION.BB, bet: 1 }, { position: POSITION.UTG, bet: 0 },
    { position: POSITION.HJ, bet: 0 }, { position: POSITION.CO, bet: 0 }, { position: POSITION.BTN, bet: 0 }]
    const informations: string[] = scenario.split(" ");
    const situation: string = informations.pop();
    let btr: POSITION;
    switch (situation) {
        case "OP":
            break;
        case "3-Bet":
            if (informations[1] === "Flatting")
                btr = Math.round(Math.random()) ? POSITION.UTG : POSITION.HJ;
            else {
                let str: string = informations[2].includes("/") ? informations[2].split("/")[Math.round(Math.random())] : informations[2];
                btr = POSITION[str];
            }
            bets.find(bet => bet.position === btr).bet = Math.floor(Math.random() * 4 + 2);
            break;
        case "4-Bet":
            maxValue = Math.floor(Math.random() * 4 + 2);
            const newBet = maxValue * (Math.round(Math.random()) + 1) * 4;
            bets.find((bet) => bet.position === POSITION[informations[0]]).bet = maxValue;
            if (informations[2] === "Blind") {
                const adv = Math.round(Math.random());
                bets.find(bet => {
                    return POSITION[bet.position] === POSITION[adv]
                }).bet = newBet;
            }
            else if (informations.length === 3) {
                btr = POSITION[informations[2]];
                bets.find(bet => bet.position === btr).bet = newBet;
            }
            else {
                let value: number = POSITION[informations[0]];
                value = informations[1] === "IP" ? Math.round(Math.random()) * (value - 1) : value + Math.round(1 + Math.random() * (4 - value));
                bets.find(bet => bet.position === value).bet = newBet;
            }
            break;
        case "5-Bet":
            maxValue = Math.floor(Math.random() * 4 + 4);
            bets.find(bet => bet.position === POSITION[informations[0]]).bet = maxValue;
            let str: string = informations[informations.length - 1].includes("/") ? informations[informations.length - 1].split("/")[Math.round(Math.random())] : informations[informations.length - 1];
            btr = POSITION[str];
            bets.find(bet => bet.position === btr).bet = maxValue * (Math.round(Math.random()) + 1) * 3;
            break;
    }
    return bets;
}