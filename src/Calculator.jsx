import { useEffect, useRef, useState } from "react";
import { addition, subtraction, multiplication, division } from "./utility";
import { login } from "./api";
import("./calculator.css");

import { useQueue } from "./QueueContext";

const Calculator = () => {
  const [operator, setOperator] = useState("");
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [result, setResult] = useState("");
  const [user, setUser] = useState("");
  const operatorLogTrack = useRef(null);
  const cleredResult = useRef(true);

  const { enqueue } = useQueue();

  const startSequencer = () => {
    localStorage.setItem("sequencer", 1);
  };

  const registerBrowser = async () => {
    let currentUser = localStorage.getItem("_userId");
    if (!currentUser) {
      const user = await login();
      if (user) {
        localStorage.setItem("_userId", user);
        setUser(user);
      }
    } else {
      setUser(currentUser);
    }
  };

  useEffect(() => {
    registerBrowser();
    startSequencer();
  }, []);

  const isNumber = (str) => !isNaN(str) || str === ".";

  const isOperator = (str) => ["+", "-", "x", "÷"].includes(str);

  const getDisplay = () => {
    if (result) return result;
    if (secondNumber) return secondNumber;
    if (operator) return operator;
    return firstNumber || "0";
  };

  const handleCalculate = () => {
    const a = parseFloat(firstNumber);
    const b = parseFloat(secondNumber);

    if (isNaN(a) || isNaN(b)) return;

    let res = "";
    switch (operator) {
      case "+":
        res = addition(a, b);
        break;
      case "-":
        res = subtraction(a, b);
        break;
      case "x":
        res = multiplication(a, b);
        break;
      case "÷":
        res = division(a, b);
        break;
      default:
        res = "Error";
    }

    setResult(res);
    setFirstNumber(res.toString());
    setSecondNumber("");
    setOperator("");
  };

  const addLogActionToQueue = (action, value) => {
    const currentSequence = parseInt(localStorage.getItem("sequencer"));
    const actionItem = {
      action,
      value,
      timeStamp: Date.now(),
      sequence: currentSequence,
      userId: user,
    };
    enqueue(actionItem);
    localStorage.setItem("sequencer", currentSequence + 1);
  };

  const keyPressed = (key) => {
    if (result) {
      if (isOperator(key)) {
        setFirstNumber(`${result}`);
        cleredResult.current = false;
      } else {
        setFirstNumber("");
        cleredResult.current = true;
      }
      setResult("");
      setSecondNumber("");
      operatorLogTrack.current = null;
    }

    if (key === "=") {
      addLogActionToQueue("numberEntered", secondNumber);
      addLogActionToQueue("operatorEntered", "=");
      handleCalculate();
      return;
    }

    if (isOperator(key)) {
      if (firstNumber && !secondNumber) {
        if (!operator && cleredResult.current) {
          addLogActionToQueue("numberEntered", firstNumber);
        }
        setOperator(key);
      }
      return;
    }

    if (isNumber(key)) {
      if (!operator) {
        setFirstNumber((prev) => prev + key);
      } else {
        if (!operatorLogTrack.current) {
          addLogActionToQueue("operatorEntered", operator);
          operatorLogTrack.current = true;
        }
        setSecondNumber((prev) => prev + key);
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="screen">
        <div className="content">{getDisplay()}</div>
      </div>
      <div className="keypad">
        <div className="first-row">
          <div onClick={() => keyPressed("7")}>7</div>
          <div onClick={() => keyPressed("8")}>8</div>
          <div onClick={() => keyPressed("9")}>9</div>
          <div className="plus" onClick={() => keyPressed("+")}>
            +
          </div>
        </div>
        <div className="second-row">
          <div onClick={() => keyPressed("4")}>4</div>
          <div onClick={() => keyPressed("5")}>5</div>
          <div onClick={() => keyPressed("6")}>6</div>
          <div className="minus" onClick={() => keyPressed("-")}>
            -
          </div>
        </div>
        <div className="third-row">
          <div onClick={() => keyPressed("1")}>1</div>
          <div onClick={() => keyPressed("2")}>2</div>
          <div onClick={() => keyPressed("3")}>3</div>
          <div className="multiply" onClick={() => keyPressed("x")}>
            x
          </div>
        </div>
        <div className="fourth-row">
          <div onClick={() => keyPressed("0")}>0</div>
          <div onClick={() => keyPressed(".")}>.</div>
          <div onClick={() => keyPressed("=")}>=</div>
          <div className="divide" onClick={() => keyPressed("÷")}>
            &divide;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
