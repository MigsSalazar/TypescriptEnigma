# Typescript Enigma!
Hi y'all! So I thought I'd have some fun and made myself a TypeScript Enigma Machine!

To get this up and running, you need 
1. node
2. typescript & @types/node 
3. ts-node

[ts-node](https://www.npmjs.com/package/ts-node) allows you to run 
TypeScript from the command like as if it were a bash script. It just wraps
the code in a node environment and then executes the code in the file provided. 
You can install it globally or within the directory. 

If you install only to the directory, you will need to run it with npx.

If you want a break down on how to run the code, you can use the

`npm run help`

Or just read it down below because I just copy pasted what the help command spits out below.
```
TypeScript Enigma Help!
Usage: ts-node .\\Main.ts [-decode] [-f] [-msg] [-p] [-mtr] [-rftr]

Options:
	-decode 	Sets the machine to work in decode mode only. Message will not
			be encoded and then decoded. WARNING: ALL OTHER ARGS MUST BE
			PROVIDED. 

	-f 		Marks the provided message string as a file path. Does nothing
			if a message is not provided

	-msg		Message you wish to encrypt with the enigma machine
			Leave blank to use "Test Message"

	-p 		Plug board configuration. Expected to be "none" or a string of 
			26 letters, where each letter of the alphabet is used once, and 
			each 2 letters creates a plug board pair.
			Example: 
				ABCDEF... 
				will create plug board pairs of 
				A<->B, C<->D, E<->F...
			If flag not provided, then a random plugboard configuration will be used.
			If set to "none", a plugboard will not be used.

	-mtr		Motor configuration. Expects a comma delimited list of 3-5 motor
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
				
	-rftr		The reflector option defined with a single character B or C. 
			If flag not provided, a random option will be used.
```