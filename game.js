const readline = require("readline");
const keypress = require("keypress");

class SafeCrackerGame {
  constructor() {
    this.multipliers = [15, 16, 17, 18, 19, 20];
    this.grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    this.selectedMultipliers = [];
    this.spinsLeft = 4;
    this.betAmount = 0;
    this.totalWinAmount = 0;
    this.winningMultiplier = null;
    this.initializeGame();
  }

  initializeGame() {
    this.selectMultipliers();
    this.drawGrid();
    this.promptBetAmount();
  }

  selectMultipliers() {
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * this.multipliers.length);
      const multiplier = this.multipliers[randomIndex];
      this.selectedMultipliers.push(multiplier);
    }
  }

  drawGrid() {
    console.log("-----------------------------------------");
    for (let i = 0; i < 3; i++) {
      let row = "|";
      for (let j = 0; j < 3; j++) {
        row += ` ${this.grid[i][j]} |`;
      }
      console.log(row);
      console.log("-----------------------------------------");
    }
    console.log("Press [SPACE] to spin");
  }

  promptBetAmount() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Set your bet amount: ", (answer) => {
      this.betAmount = parseFloat(answer);
      rl.close();
      this.initKeyPressListener();
    });
  }

  initKeyPressListener() {
    keypress(process.stdin);
    process.stdin.on("keypress", (ch, key) => {
      if (key && key.name === "space") {
        this.spin();
      }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  spin() {
    this.spinsLeft--;
    const boxNumber = Math.floor(Math.random() * 9) + 1;
    const multiplier = this.selectedMultipliers[boxNumber - 1];

    console.clear();
    console.log(`Spin ${5 - this.spinsLeft} opens box ${boxNumber}, a x${multiplier} multiplier is revealed`);
    this.updateGrid(boxNumber);
    this.checkWinCondition(multiplier);

    if (this.spinsLeft > 0 && this.winningMultiplier === null) {
      console.log(`\nSpins left: ${this.spinsLeft}`);
      console.log("Press [SPACE] to spin");
    } else {
      console.log(`\nGame complete! You won x${this.winningMultiplier} your initial bet amount of ${this.betAmount}`);
      console.log(`Total win amount: ${this.totalWinAmount}`);
      process.stdin.pause();
    }
  }

  updateGrid(boxNumber) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[i][j] === boxNumber) {
          this.grid[i][j] = `x${this.selectedMultipliers[boxNumber - 1]}`;
        }
      }
    }
    this.drawGrid();
  }

  checkWinCondition(multiplier) {
    if (multiplier !== undefined && this.winningMultiplier === null) {
      this.winningMultiplier = multiplier;
      this.totalWinAmount = (this.betAmount * multiplier) - this.betAmount;
    } else if (multiplier === undefined) {
      this.totalWinAmount = 0;
    }
  }
  
}

// Start the game
new SafeCrackerGame();
