
export class PlugboardConfig{
    private config: [string, string][];

    constructor(plug: [string, string][]){
        this.verifyPlugboard(plug);
        this.config = plug;
    }

    printConfig = () => {
        console.log("Plugboard configuration:")
    	console.log(this.config);
    }

    passthrough = (letter: string) => {
        let filtered = this.config.filter(pair => pair[0] == letter || pair[1] == letter);
        let first = filtered[0];
        return first[0] == letter ? first[1] : first[0];
    }

    private verifyPlugboard = (config: [string, string][]) => {
        if(config.length != 13){
            throw new TypeError("Configuration must contain 13 pairings for all 26 letters in the alphabet");
        }

        const item1Set = new Set<string>();
        const item2Set = new Set<string>();

        config.forEach(pair => {
            if(pair[0].length != 1 || pair[1].length != 1){
                throw new TypeError("Plugboard mush contain pairings of single characters");
            }

            if(item1Set.has(pair[0])) throw new TypeError("Plugboard must only contain on instance of each character");
            else item1Set.add(pair[0]);

            if(item2Set.has(pair[1])) throw new TypeError("Plugboard must only contain on instance of each character");
            else item2Set.add(pair[1]);

        });

        if(item1Set.size != 13 || item2Set.size != 13){
            throw new TypeError("Plugboard must contain a configuration containing all 26 characters. NOTE: they must all be capitalized to be accepted")
        }
    }
}
