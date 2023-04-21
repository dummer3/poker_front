import chip_img from "../img/chip.webp"

const chipSize = 25

const chipsValue = [
    { color: "black", value: 100 },
    { color: "green", value: 25 },
    { color: "blue", value: 10 },
    { color: "red", value: 5 },
    { color: "white", value: 1 }
]

export const BreakDownToChip = (value: number) => {
    let index: number = 0;

    let currentChip: any[] = [
        { color: "black", value: 0 },
        { color: "green", value: 0 },
        { color: "blue", value: 0 },
        { color: "red", value: 0 },
        { color: "white", value: 0 }
    ];

    while (value > 0) {
        while (chipsValue[index].value > value) {
            index++;
        }

        currentChip[index].value++;
        value -= chipsValue[index].value;
    }

    return currentChip.filter(x => x.value !== 0)
}

const ChipStack = (stack, stack_index: number) => {
    return (Array.from({ length: stack.value }, (_, index) => {
        return <img src={chip_img} width={`${chipSize}px`} className={stack.color + "-token"} key={`stack-${stack_index}-${index}`} alt={`${stack.color}-token`} style={{
            position: 'relative',
            left: stack_index * chipSize + 'px',
            top: -index * chipSize / 10 + 'px',
        }}></img>
    }))
}

export const ValueWithChip = (number: number) => {


    const chips = BreakDownToChip(number);

    const length = chips.length - 1;

    let dist = -length * chipSize;

    return (
        <div className='value-bet inline-layered col' style={{ marginLeft: dist + 'px' }}>
            {chips.map((stack, stack_index) => { return ChipStack(stack, stack_index) })}
        </div>);
}