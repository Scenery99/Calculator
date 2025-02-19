let expression = "";

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

function updateDisplay(value) {
  display.textContent = value;
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    
    if (value === "C") { 
      expression = "";
      updateDisplay("0");
    } else if (value === "⌫") { 
      expression = expression.slice(0, -1);
      updateDisplay(expression === "" ? "0" : expression);
    } else if (value === "=") { 
      try {
        const result = evaluateExpression(expression);
        updateDisplay(result);
        expression = result.toString(); 
      } catch (error) {
        updateDisplay(error);
        expression = "";
      }
    } else {
      if (value === ".") {
        const lastPlus = expression.lastIndexOf("+");
        const lastMinus = expression.lastIndexOf("-");
        const lastMultiply = expression.lastIndexOf("*");
        const lastDivide = expression.lastIndexOf("/");
        const lastOperatorIndex = Math.max(lastPlus, lastMinus, lastMultiply, lastDivide);
        const currentOperand = expression.slice(lastOperatorIndex + 1);
          if (currentOperand.includes(".")) {
            return;
          }
      }
      if (expression === "0") {
        expression = "";
      }
      expression += value;
      updateDisplay(expression);
    }
  });
});

function evaluateExpression(expr) {
  expr = expr.replace(/\s+/g, "");
  let index = 0;

  function parseExpression() {
    let value = parseTerm();
    while (index < expr.length) {
      if (expr[index] === "+") {
        index++;
        value += parseTerm();
      } else if (expr[index] === "-") {
        index++;
        value -= parseTerm();
      } else {
        break;
      }
    }
    return value;
  }

  function parseTerm() {
    let value = parseFactor();
    while (index < expr.length) {
      if (expr[index] === "*") {
        index++;
        value *= parseFactor();
      } else if (expr[index] === "/") {
        index++;
        let divisor = parseFactor();
        if (divisor === 0) throw "Ошибка: Деление на 0";
        value /= divisor;
      } else {
        break;
      }
    }
    return value;
  }

  function parseFactor() {
    if (expr[index] === "+") {
      index++;
      return parseFactor();
    }
    if (expr[index] === "-") {
      index++;
      return -parseFactor();
    }
    if (expr[index] === "(") {
      index++;
      let value = parseExpression();
      if (expr[index] === ")") {
        index++;
      } else {
        throw "Ошибка: Несовпадение скобок";
      }
      return value;
    }

    let start = index;
    while (index < expr.length && (isDigit(expr[index]) || expr[index] === '.')) {
      index++;
    }
    if (start === index) {
      throw "Ошибка: Ожидалось число, найден символ '" + expr[index] + "'";
    }
    return parseFloat(expr.slice(start, index));
  }

  function isDigit(char) {
    return char >= "0" && char <= "9";
  }
  let result = parseExpression();
  if (index < expr.length) {
    throw "Ошибка: Некорректное выражение";
  }
  return result;
}


