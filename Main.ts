import {argSplitter, printHelp} from "./Helpers";
import {Enigma} from "./Enigma";

if(process.argv.includes("-help")){
    printHelp();
}else{
    var {message, plugboard, motors, reflector} = argSplitter(process.argv);
    plugboard.printConfig();

    console.log(`Reflector type: ${reflector}`);

    var motorSettings = motors.map(m => m.setting);
    console.log("Motor Settings (motor number, initial setting)");
    motors.forEach(m => console.log(m.toString()));

    //let enigma: Enigma = new Enigma(motors, plugboard);
    let enigma: Enigma = new Enigma(motors, null, reflector);

    let starting = message ? message : "Test Message";
    //let starting = "ABCDEF";
    console.log("Message: " + starting);

    let testChar = enigma.encodeMessage(starting);
    console.log("Encrypted Message: "+testChar);

    motorSettings.forEach((s,i)=>motors[i].setting = s);
    //let fresh: Enigma = new Enigma(motors, plugboard);
    let fresh: Enigma = new Enigma(motors, null, reflector);

    let rerun = fresh.encodeMessage(testChar);
    console.log("Decrypted message: " + rerun);
}