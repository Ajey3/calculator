const display = document.getElementById("display");
const buttons = document.querySelectorAll("button[data-value]");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const historyList = document.getElementById("historyList");

let input = "";

// --- Safe Expression Evaluator (NO eval) ---
function evaluateExpression(expr) {
  try {
    const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
    if (!tokens) return "";

    // First pass: handle * and /
    let stack = [];
    let i = 0;

    while (i < tokens.length) {
      let token = tokens[i];

      if (token === "*" || token === "/") {
        let prev = stack.pop();
        let next = tokens[++i];
        let result = token === "*"
          ? parseFloat(prev) * parseFloat(next)
          : parseFloat(prev) / parseFloat(next);
        stack.push(result);
      } else {
        stack.push(token);
      }
      i++;
    }

    // Second pass: handle + and -
    let result = parseFloat(stack[0]);

    for (let i = 1; i < stack.length; i += 2) {
      let operator = stack[i];
      let next = parseFloat(stack[i + 1]);

      if (operator === "+") result += next;
      if (operator === "-") result -= next;
    }

    return result;
  } catch {
    return "Error";
  }
}

// --- Update display ---
function updateDisplay() {
  display.value = input;
}

// --- Add to history ---
function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li);
}

// --- Button clicks ---
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    input += btn.dataset.value;
    updateDisplay();
  });
});

// --- Equals ---
equals.addEventListener("click", () => {
  const result = evaluateExpression(input);
  if (result !== "Error") {
    addToHistory(input, result);
  }
  input = result.toString();
  updateDisplay();
});

// --- Clear ---
clear.addEventListener("click", () => {
  input = "";
  updateDisplay();
});

// --- Keyboard Support ---
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || "+-*/.".includes(key)) {
    input += key;
  } else if (key === "Enter") {
    const result = evaluateExpression(input);
    if (result !== "Error") {
      addToHistory(input, result);
    }
    input = result.toString();
  } else if (key === "Backspace") {
    input = input.slice(0, -1);
  } else if (key.toLowerCase() === "c") {
    input = "";
  }

  updateDisplay();
});