
export type motorSelection = -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type motorSetting = -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26;
export const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

export function getMotor(variant: motorSelection, setting: motorSetting) {
    switch (variant) {
        case 1:
            return new MotorI(setting);
        case 2:
            return new MotorII(setting);
        case 3:
            return new MotorIII(setting);
        case 4:
            return new MotorIV(setting);
        case 5:
            return new MotorV(setting);
        case 6:
            return new MotorVI(setting);
        case 7:
            return new MotorVII(setting);
        case 8:
            return new MotorVIII(setting);
    }
}

export class Motor {
    order: string[];
    setting: number;
    turnover: string[];
    nextMotor: Motor | null = null;
    prevMotor: Motor | null = null;

    constructor(o: string[], s: number, t: string[]){
        this.order = [];
        this.turnover = t;

        this.validMotor(o);
        this.setting = s % 26;
    }

    public toString = () : string => {
    	return this.order.toString() + "," + this.setting;
    }

    runForwardChain = (letter: string) => {
        const result = this.runFromFront(letter);
        if(this.nextMotor !== null)
            return this.nextMotor.runForwardChain(result);
        return result;
    }

    runFromFront = (letter: string) => {
        let index = (alphabet.indexOf(letter) + this.setting) % 26;
        return this.order[index];
    }

    runBackwardChain = (letter: string) => {
        const result = this.runFromBack(letter);
        if(this.prevMotor !== null)
            return this.prevMotor.runBackwardChain(result);
        return result;
    }

    runFromBack = (letter: string) => {
        let index = (this.order.indexOf(letter) - this.setting);
        while(index < 0) index += 26;
        return alphabet[index];
    }

    public setNextMotor = (next: Motor | null) => {
        this.nextMotor = next;
    }

    public setPrevMotor = (prev: Motor | null) => {
        this.prevMotor = prev;
    }

    public stepMotorSetting = () => {
        //console.log(`stepping motor: ${this.setting}`)
        this.setting += 1;
        this.setting = this.setting % 26;
        //console.log(`new setting: ${this.setting}`)

        if(this.nextMotor !== null && this.turnover.includes(alphabet[this.setting])){
            this.nextMotor.stepMotorSetting();
        }
    }

    private validMotor = (order: string[]) => {
        if(order.length != 26)
            throw new TypeError("Motor must contain on of each letter, all alphabetized");
        const subSet = new Set<string>();
        order.forEach(letter => {
            if(subSet.has(letter))
                throw new TypeError(`Duplicate letter ${letter} was found in the motor config`);
            else
                subSet.add(letter);
        });
        this.order = [...order];
    }
}

export class MotorI extends Motor{
    constructor(s: number){
        super(["E","K","M","F","L","G","D","Q","V","Z","N","T","O","W","Y","H","X","U","S","P","A","I","B","R","C","J"], s, ['R']);
    }
    public toString = () : string => {
    	return "1," + this.setting;
    }
}

export class MotorII extends Motor{
    constructor(s: number){
        super(["A","J","D","K","S","I","R","U","X","B","L","H","W","T","M","C","Q","G","Z","N","P","Y","F","V","O","E"], s, ['F']);
    }
    public toString = () : string => {
    	return "2," + this.setting;
    }
}

export class MotorIII extends Motor{
    constructor(s: number){
        super(["B","D","F","H","J","L","C","P","R","T","X","V","Z","N","Y","E","I","W","G","A","K","M","U","S","Q","O"], s, ['W']);
    }
    public toString = () : string => {
    	return "3," + this.setting;
    }
}

export class MotorIV extends Motor{
	constructor(s: number){
		super(["E","S","O","V","P","Z","J","A","Y","Q","U","I","R","H","X","L","N","F","T","G","K","D","C","M","W","B"], s, ['K']);
	}
	public toString = () : string => {
    	return "4," + this.setting;
    }
}

export class MotorV extends Motor{
	constructor(s: number){
		super(["V","Z","B","R","G","I","T","Y","U","P","S","D","N","H","L","X","A","W","M","J","Q","O","F","E","C","K"], s, ['A']);
	}
	public toString = () : string => {
    	return "5," + this.setting;
    }
}

export class MotorVI extends Motor{
	constructor(s: number){
		super(["J","P","G","V","O","U","M","F","Y","Q","B","E","N","H","Z","R","D","K","A","S","X","L","I","C","T","W"], s, ['A', 'N']);
	}
	public toString = () : string => {
    	return "6," + this.setting;
    }
}

export class MotorVII extends Motor{
	constructor(s: number){
		super(["N","Z","J","H","G","R","C","X","M","Y","S","W","B","O","U","F","A","I","V","L","P","E","K","Q","D","T"], s, ['A', 'N']);
	}
	public toString = () : string => {
    	return "7," + this.setting;
    }
}

export class MotorVIII extends Motor{
	constructor(s: number){
		super(["F","K","Q","H","T","L","X","O","C","B","J","S","P","D","Z","R","A","M","E","W","N","I","U","Y","G","V"], s, ['A', 'N']);
	}
	public toString = () : string => {
    	return "8," + this.setting;
    }
}