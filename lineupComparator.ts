import * as readline from "readline";

const lineupComparator: (str1: string, str2: string) => [boolean, string, string[], string[]] = (str1: string, str2: string) => {
    let lineup1 = resolveLineup(str1);
    let lineup2 = resolveLineup(str2);
    let same = true;
    let errorIn: string = "";
    for (let period in lineup1) {
        if (lineup1[period].length !== lineup2[period].length) {
            same = false;
            errorIn = period;
            break;
        }
        if (!lineup1[period].every((player) => lineup2[period].includes(player))) {
            same = false;
            errorIn = period;
            break;
        }
    }

    return [same, errorIn, lineup1[errorIn || "1"], lineup2[errorIn || "1"]];
};

const resolveLineup: (lineup: string) => {} = (lineup: string) => {
    let periods = lineup.split("//");
    let lineupObj: { [key in number]: string[] } = {};
    for (let period of periods) {
        let [pd, players, l1, l2] = period.split("::");
        if (!pd) continue;
        let periodNumber = parseInt(pd);
        if (!periodNumber) throw new Error("Invalid period number");
        let rawPlayerList = players.match(/"(\w*)"/g);
        let playerList = rawPlayerList?.map((player) => player.replace(/"/g, ""));
        lineupObj[periodNumber] = playerList || [];
    }
    return lineupObj;
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Input lineups, press Ctrl+C to exit");

const ask = () => {
    let l1 : string;
    let l2 : string;
    rl.question('Lineup 1: ', (answer) => {
        l1 = answer;
        rl.question('Lineup 2: ', (answer) => {
            l2 = answer;
            let [same, errorIn, l1e, l2e] = lineupComparator(l1, l2);
            console.log(same ? "Lineups are the same!\n" : `Lineups are different! Mismatch in period ${errorIn}`);
            console.log(l1e, l2e);
            console.log("\n");
            ask();
        });
    });
};

ask();