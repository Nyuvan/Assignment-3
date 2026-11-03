// Run a callback for each item. The optional filter callback decides which
// items to include in the result.
function processArray(arr, callback, filterCallback) {
  const results = [];

  for (const item of arr) {
    if (!filterCallback || filterCallback(item)) {
      results.push(callback(item));
    }
  }

  return results;
}

function processString(str, callback) {
  return callback(str);
}

function calculate(a, b, callback) {
  return callback(a, b);
}

function findElement(arr, callback) {
  for (const item of arr) {
    if (callback(item)) return item;
  }

  return undefined;
}

function squareNumber(number) {
  return number * number;
}

function keepNumber(number) {
  return number;
}

function isEven(number) {
  return number % 2 === 0;
}

function makeUppercase(str) {
  return str.toUpperCase();
}

function countWords(str) {
  const trimmedString = str.trim();
  if (trimmedString === "") return 0;
  return trimmedString.split(/\s+/).length;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero.");
  return a / b;
}

function runExamples() {
  const numbers = [1, 2, 3, 4, 5, 6];
  const sentence = "Callbacks make functions flexible.";
  const firstNumber = 10;
  const secondNumber = 5;

  console.log("Squares:", processArray(numbers, squareNumber));
  console.log("Even numbers:", processArray(numbers, keepNumber, isEven));
  console.log("Uppercase:", processString("hello world", makeUppercase));
  console.log("Word count:", processString(sentence, countWords));
  console.log("Addition:", calculate(firstNumber, secondNumber, add));
  console.log("Subtraction:", calculate(firstNumber, secondNumber, subtract));
  console.log("Multiplication:", calculate(firstNumber, secondNumber, multiply));
  console.log("Division:", calculate(firstNumber, secondNumber, divide));
  console.log("First number greater than 4:", findElement(numbers, function (n) {
    return n > 4;
  }));
}

// The menu is optional. Run this file with --menu to open it.
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

async function runArithmeticMenu(rl) {
  const firstInput = (await rl.question("First number: ")).trim();
  const secondInput = (await rl.question("Second number: ")).trim();
  const a = Number(firstInput);
  const b = Number(secondInput);

  if (firstInput === "" || secondInput === "" || !Number.isFinite(a) || !Number.isFinite(b)) {
    console.log("Please enter two valid numbers.");
    return;
  }

  console.log("Choose an operation: 1) Add  2) Subtract  3) Multiply  4) Divide");
  const choice = (await rl.question("Operation number: ")).trim();
  const operations = {
    "1": { name: "Addition", callback: add },
    "2": { name: "Subtraction", callback: subtract },
    "3": { name: "Multiplication", callback: multiply },
    "4": { name: "Division", callback: divide }
  };
  const operation = operations[choice];

  if (!operation) {
    console.log("Choose an operation from 1 to 4.");
    return;
  }

  try {
    console.log(operation.name + " result:", calculate(a, b, operation.callback));
  } catch (error) {
    console.log(error.message);
  }
}

function parseNumberList(input) {
  const parts = input.split(",");
  if (parts.some((part) => part.trim() === "")) return null;

  const numbers = parts.map((part) => Number(part.trim()));
  if (numbers.some((number) => !Number.isFinite(number))) return null;

  return numbers;
}

async function runArrayMenu(rl) {
  const input = await rl.question("Enter numbers separated by commas: ");
  const numbers = parseNumberList(input);

  if (!numbers || numbers.length === 0) {
    console.log("Enter a list such as 1, 2, 3, 4.");
    return;
  }

  console.log("Choose: 1) Square numbers  2) Keep even numbers  3) Find first even number");
  const choice = (await rl.question("Analysis number: ")).trim();

  if (choice === "1") {
    console.log("Squares:", processArray(numbers, squareNumber));
  } else if (choice === "2") {
    console.log("Even numbers:", processArray(numbers, keepNumber, isEven));
  } else if (choice === "3") {
    console.log("First even number:", findElement(numbers, isEven));
  } else {
    console.log("Choose an analysis from 1 to 3.");
  }
}

async function runMenu() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    let keepRunning = true;

    while (keepRunning) {
      console.log("\nCallback Utility System");
      console.log("1) Arithmetic calculator");
      console.log("2) Array analysis");
      console.log("0) Exit");
      const choice = (await rl.question("Choose an option: ")).trim();

      if (choice === "1") {
        await runArithmeticMenu(rl);
      } else if (choice === "2") {
        await runArrayMenu(rl);
      } else if (choice === "0") {
        keepRunning = false;
      } else {
        console.log("Choose 1, 2, or 0.");
      }
    }
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  if (process.argv.includes("--menu")) {
    runMenu().catch((error) => {
      console.error("The menu stopped because of an error:", error.message);
      process.exitCode = 1;
    });
  } else {
    runExamples();
    console.log("\nFor the optional menu, run: node callback_based_utility.js --menu");
  }
}
