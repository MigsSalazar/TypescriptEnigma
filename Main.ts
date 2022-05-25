import {argSplitter, printHelp} from "./Helpers";
import {Enigma} from "./Enigma";

if(process.argv.includes("-help")){
	printHelp();
}else{
	let {message, plugboard, motors, reflector, decodeOnly} = argSplitter(process.argv);
	let motorSettings = motors.map(m => m.setting);

	if(plugboard){
		plugboard.printConfig();
	}else{
		console.log("Plugboard unused");
	}
	console.log(`Reflector type: ${reflector}`);
	console.log("Motor Settings (motor number, initial setting)");
	motors.forEach(m => console.log(m.toString()));
	let starting = message ? message : "Test Message";

	if(!decodeOnly){
		console.log("Message: " + starting);
		let enigma: Enigma = new Enigma(motors, plugboard, reflector);
		starting = enigma.encodeMessage(starting);
		
		motorSettings.forEach((s,i)=>{
			motors[i].setting = s;
		});
	}else{
		console.log("DECRYPTING MESSAGE ONLY");
	}
	console.log("Encrypted Message: "+starting);
	
	let fresh: Enigma = new Enigma(motors, plugboard, reflector);
	let rerun = fresh.encodeMessage(starting);
	console.log("Decrypted message: " + rerun);
}