import { ReflectorType } from "./Enigma";
import {
    motorSelection, 
    motorSetting, 
    Motor,
    getMotor
} from "./Motor";
import {PlugboardConfig} from "./PlugboardConfig";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
  
export function generatePlugboard(plugOrder?: string){
      let pairs: [string, string][] = [];
  
      if(plugOrder){
          let myOrder = "" + plugOrder;
          while(myOrder.length > 0){
              let first = myOrder[0].charAt(0);
              myOrder = myOrder.substring(1);
              let second = myOrder.charAt(0);
              myOrder = myOrder.substring(1);
  
              pairs.push([first, second]);
          }
      }else{
          console.log("No plugboard config provided. Generating random config...");
          let alpha = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
          while(alpha.length > 0){
              let first = alpha[getRandomInt(alpha.length)];
              alpha = alpha.filter(a => a != first);
              let second = alpha[getRandomInt(alpha.length)];
              alpha = alpha.filter(a => a != second);
  
              pairs.push([first, second]);
          }
      }
      
      return new PlugboardConfig(pairs);
  }
  
export function produceMotors(motorDetails: [motorSelection, motorSetting][]){
    let motors: Motor[] = [];
    let myDefs = [...motorDetails];

    while(myDefs.length < 3){
        myDefs.push([-1, -1]);
    }
    let usedMotors = new Set<motorSelection>(myDefs.map(def => def[0]));
    myDefs.forEach((details, idx) => {
        let sel: motorSelection = details[0] != -1 ? details[0] : pickFreshMotor(usedMotors);
        let set: motorSetting = details[1] != -1 ? details[1] : (getRandomInt(26) + 1) as motorSetting;
        motors.push(getMotor(sel, set)) 
        if(idx > 0){
            motors[idx].setPrevMotor(motors[idx - 1]);
            motors[idx - 1].setNextMotor(motors[idx]);
        }
    });
    return motors;
}

function pickFreshMotor(usedMotors: Set<motorSelection>){
    let result: motorSelection = -1;
    do{
        result = (getRandomInt(8) + 1) as motorSelection;
    }while(usedMotors.has(result))
    usedMotors.add(result);
    return result;
}


function stringToMotorDefs(motorDefs?: string){
	if(motorDefs == undefined){
        console.log("Motor configs not provided. Generating random configs...");
		return [];
	}
	let nums = motorDefs.split(",");
	if(nums.length < 6 || nums.length > 10 || nums.length % 2 != 0){
		throw new TypeError("motor definitions are defined in pairs of numbers and there must be at least 3 motor definitions and no more than 5");
	}
	let ret: [motorSelection, motorSetting][] = [];
	while(nums.length > 0){
		let first = +nums.shift() as motorSelection;
		let second = +nums.shift() as motorSetting;
		ret.push([first, second]);
	}
	return ret;
}

export interface EnigmaConfiguration{
	message: string | undefined;
	plugboard: PlugboardConfig | null;
	motors: Motor[];
	reflector: ReflectorType | undefined;
	decodeOnly: boolean;
}

export function argSplitter(args: string[]): EnigmaConfiguration{
	let message: string | undefined= undefined;
    let plugboardStr: string | undefined = undefined;
    let motorsStr: string | undefined= undefined;
    let reflector: ReflectorType | undefined = undefined;

    let msgIdx = args.findIndex(a => a == "-msg");
    let plgbrdIdx = args.findIndex(a => a == "-p");
    let mtrIdx = args.findIndex(a => a == "-mtr");
    let rftrIdx = args.findIndex(a => a == "-rftr");

	let decode = args.findIndex(a => a =="-decode");
	let decodeOnly = false;
	if(decode > -1){
		if(plgbrdIdx == -1 || msgIdx == -1 || rftrIdx == -1){
			throw new TypeError("Cannot decode a message without all configurations provided along with the message.");
		}
		decodeOnly = true;
	}

    if(msgIdx > -1){
        if(args.length > (msgIdx + 1) && args[msgIdx + 1] != "-p" && args[msgIdx + 1] != "-mtr"){
            message = args[msgIdx + 1];
        }else{
            throw new TypeError("Message flag must be followed by a message");
        }
    }

    if(plgbrdIdx > -1){
        if(args.length <= (plgbrdIdx + 1) ){
            throw new TypeError("Plugboard flag must be followed by a plugboard configuration");
        }else if( args[plgbrdIdx + 1] != "-msg" && args[plgbrdIdx + 1] != "-mtr"){
            plugboardStr = args[plgbrdIdx + 1];
        }else{
            throw new TypeError("Plugboard flag cannot be followed by another flag");
        }
    }

    if(mtrIdx > -1){
        if(args.length <= (mtrIdx + 1) ){
            throw new TypeError("Motor flag must be followed by a motor configuration");
        }else if( args[mtrIdx + 1] != "-msg" && args[mtrIdx + 1] != "-mtr"){
            motorsStr = args[mtrIdx + 1];
        }else{
            throw new TypeError("Motor config flag cannot be followed by another flag");
        }
    }

    if(rftrIdx > -1){
        if(args.length <= (plgbrdIdx + 1) ){
            throw new TypeError("Reflector flag must be followed by a reflector configuration of 'B' or 'C'");
        }else{ 
            const upperCased = args[rftrIdx + 1].toUpperCase();
            if(upperCased == "B" || upperCased == "C"){
                reflector = upperCased as ReflectorType;
            }else{
                const throwString = `Invalid reflector configuration. Reflector flag must be followed by a reflector configuration of 'B' or 'C'. Received;${upperCased};`;
                throw new TypeError(throwString);
            }
        }
    }else{
        console.log("Reflector type not provided. Selecting type at random...");
        reflector = getRandomInt(2) == 1 ? 'B' : 'C';
    }

    let plugboard = plugboardStr !== "none" ? generatePlugboard(plugboardStr) : null;
    let motors = produceMotors(stringToMotorDefs(motorsStr));

    return { message, plugboard, motors, reflector, decodeOnly };
}

export function printHelp(){
    console.log(`
TypeScript Enigma Help!
Usage: ts-node .\\Main.ts [-decode] [-msg] [-p] [-mtr] [-rftr]

Options:
	-decode 	Sets the machine to work in decode mode only. Message will not
				be encoded and then decoded. WARNING: ALL OTHER ARGS MUST BE
				PROVIDED. 
				
    -msg        Message you wish to encrypt with the enigma machine
                Leave blank to use "Test Message"

    -p          Plug board configuration. Expected to be "none" or a string of 
                26 letters, where each letter of the alphabet is used once, and 
                each 2 letters creates a plug board pair.
                Example: 
                    ABCDEF... 
                    will create plug board pairs of 
                    A<->B, C<->D, E<->F...
                If flag not provided, then a random plugboard configuration will be used.
                If set to "none", a plugboard will not be used.

    -mtr        Motor configuration. Expects a comma delimited list of 3-5 motor
                motor configurations where each motor configuration is a tuple of 
                2 numbers: 
                    1- the motor variant, a number between 1-8
                    2- the initial motor setting, a number between 0-25
                Example:
                    1,2,3,4,5,6
                    will create a motor configuration of
                    Motor Variant 1 initialized at starting letter C
                    Motor Variant 3 initialized at starting letter E
                    Motor Variant 5 initialized at starting letter G
                If flag is not provided, then 3 random motor configurations will be used. 
                If too many or too few motor configurations are provded, process will error out
                
    -rftr       The reflector option defined with a single character B or C. 
                If flag not provided, a random option will be used.
`);
}