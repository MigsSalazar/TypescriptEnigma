import {argSplitter, printHelp} from "./Helpers";
import {Enigma} from "./Enigma";

if(process.argv.includes("-help")){
    printHelp();
}else{
    let {message, plugboard, motors, reflector} = argSplitter(process.argv);
    if(plugboard){
        plugboard.printConfig();
    }else{
        console.log("Plugboard unused");
    }

    console.log(`Reflector type: ${reflector}`);

    let motorSettings = motors.map(m => m.setting);
    console.log("Motor Settings (motor number, initial setting)");
    motors.forEach(m => console.log(m.toString()));

    let enigma: Enigma = new Enigma(motors, plugboard, reflector);

    if(message === undefined)
        console.log("No message provided. Using \"Test Message\"");
    let starting = message ? message : "Test Message";
    console.log("Message: " + starting);

    let testChar = enigma.encodeMessage(starting);
    console.log("Encrypted Message: "+testChar);

    motorSettings.forEach((s,i)=>motors[i].setting = s);
    let fresh: Enigma = new Enigma(motors, plugboard, reflector);

    let rerun = fresh.encodeMessage(testChar);
    console.log("Decrypted message: " + rerun);
}