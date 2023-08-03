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

export const ScenarioRepresentation = (scenario: string, situation: string) => {
    const bets = [{ position: POSITION.SB, bet: 0.5 }, { position: POSITION.BB, bet: 1 }, { position: POSITION.UTG, bet: 0 },
    { position: POSITION.HJ, bet: 0 }, { position: POSITION.CO, bet: 0 }, { position: POSITION.BTN, bet: 0 }]
    const informations: string[] = scenario.split(" ");
    let hero: POSITION = POSITION[informations[0]];
    let adv: POSITION;
    const alea = Math.random();
    switch (situation) {
        case "Opening":
            break;
        case "3Bet":
            if (informations[1] === "Flatting")
                adv = Math.round(alea) ? POSITION.UTG : POSITION.HJ;
            else {
                let str: string = informations[2].includes("/") ? informations[2].split("/")[Math.round(alea)] : informations[2];
                adv = POSITION[str];
            }
            bets.find(bet => bet.position === adv).bet = 2.5;
            break;
        case "4Bet":

            bets.find((bet) => bet.position === POSITION[informations[0]]).bet = 2.5;
            if (informations[2] === "Blind") {
                adv = POSITION[POSITION[Math.round(alea)]];
            }
            else if (informations.length === 3) {
                adv = POSITION[informations[2]];
            }
            else {
                let value: number = POSITION[informations[0]];
                adv = informations[1] === "IP" ? POSITION[POSITION[Math.round(alea) * (value - 1)]] : POSITION[POSITION[value + Math.round(1 + alea * (4 - value))]];
            }
            bets.find(bet => bet.position === adv).bet = adv < hero ? 9 : 11;
            break;
        case "5Bet":

            let str: string = informations[informations.length - 1].includes("/") ?
                informations[informations.length - 1].split("/")[Math.round(alea)] :
                informations[informations.length - 1];
            adv = POSITION[str];
            bets.find(bet => bet.position === adv).bet = adv < hero ? 23 : 25;
            bets.find(bet => bet.position === hero).bet = adv < hero ? 11 : 9;
            break;
    }
    return bets;
}