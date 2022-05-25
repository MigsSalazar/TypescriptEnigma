import {PlugboardConfig} from "./PlugboardConfig";
import {alphabet, Motor} from "./Motor";

export type ReflectorType = 'B' | 'C';

export class Enigma {

    motors: Motor[];
    reflector: ReflectorType;
    plugBoard: PlugboardConfig | null;

    reflectors: Record<ReflectorType, string[]> = {
        'B': ['Y','R','U','H','Q','S','L','D','P','X','N','G','O','K','M','I','E','B','F','Z','C','W','V','J','A','T'],
        'C': ['F','V','P','J','I','A','O','Y','E','D','R','Z','X','W','G','C','T','K','U','Q','S','B','N','M','H','L']
    };

    constructor(motors: Motor[], plugboardConfig: PlugboardConfig | null, reflector: ReflectorType){
        this.motors = motors;
        this.plugBoard = plugboardConfig;
        this.reflector = reflector;
    }

    public typeCharacter = (letter: string) => {
        //This isn't technically possible in the enigma machine but it's annoying when I accidentaly type something
        //and then this process spits out some garbage so I just handle the case.
        if(!alphabet.includes(letter))
            return letter;
        this.motors[0].stepMotorSetting();

        //wiring schematic taken from here https://www.cs.cornell.edu/courses/cs3110/2016fa/a1/a1.html
        let curLetter = this.plugBoard ? this.plugBoard.passthrough(letter) : letter;
        
        curLetter = this.motors[0].runForwardChain(curLetter);

        curLetter = this.reflectors[this.reflector][alphabet.indexOf(curLetter)];

        curLetter = this.motors[this.motors.length - 1].runBackwardChain(curLetter);
        
        curLetter = this.plugBoard ? this.plugBoard.passthrough(curLetter) : curLetter;
        
        return curLetter;
    }

    encodeMessage = (message: string): string => {
        let encoded = "";
        let pass = message.toUpperCase();
        for(let i=0; i<pass.length; i++){
            encoded = encoded + this.typeCharacter(pass.charAt(i));
        }
        return encoded;
    }
}