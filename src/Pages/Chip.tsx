import chip_img from "../img/chip.webp"

const chipSize = 25

// Export the enum just to be see in the TSDoc.
// It's better to let it intern since we don't need it elsewhere
// Else it should be use by one of the function below, but we don't need it also

/**
 * CHIPSVALUE enum for the conversion color <-> value.
 * @readonly
 * @public
 * @enum {number}
 */
enum CHIPSVALUE {
    "black" = 100,
    "green" = 25,
    "blue" = 10,
    "red" = 5,
    "white" = 1
}


/**
 * @public
 * Figure out the chips need to represent the value.
 * @param {number} value - Value to figure out.
 * @returns {number[]} - The list of chips to represent the value.
 */
export const BreakDownToChip = (value: number): number[] => {

    let index: number = 0;

    let currentChip: any[] = [
        { color: "black", value: 0 },
        { color: "green", value: 0 },
        { color: "blue", value: 0 },
        { color: "red", value: 0 },
        { color: "white", value: 0 }
    ];

    const values: number[] = Object.values(CHIPSVALUE).filter(k => typeof k === "number").map(k => { return +k })

    while (value > 0) {
        while (values[index] > value) {
            index++;
        }

        currentChip[index].value++;
        value -= values[index];
    }

    return currentChip.filter(x => x.value !== 0)
}

/**
 * @public
 * 
 * @param {number} stack_length - The length of this stack.
 * @param {number} stack_index - This stack index.
 * 
 * @returns {JSX.Element[]} - The representation of this stack.
 */
const ChipStack = (stack_length, stack_index: number) => {
    return (Array.from({ length: stack_length.value }, (_, index) => {
        return <img src={chip_img} width={`${chipSize}px`} className={stack_length.color + "-token"} key={`stack-${stack_index}-${index}`} alt={`${stack_length.color}-token`} style={{
            position: 'relative',
            left: stack_index * chipSize + 'px',
            top: -index * chipSize / 10 + 'px',
        }}></img>
    }))
}

/**
 * @public
 * 
 * @param {number} value - The value to represent.
 * 
 * @returns {JSX.Element} - The JSX element to represent the value with chips.
 */
export const ValueWithChip = (value: number) => {
    const chips = BreakDownToChip(value);

    const length = chips.length - 1;

    let dist = -length * chipSize;

    return (
        <div className='value-bet inline-layered col' style={{ marginLeft: dist + 'px' }}>
            {chips.map((stack, stack_index) => { return ChipStack(stack, stack_index) })}
        </div>);
}