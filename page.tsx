"use client";
import { useState } from "react";
import questions from "./questions.json";

const ladderSteps = [
  "ladderpoints100",
  "ladderpoints250",
  "ladderpoints500",
  "ladderpoints1000",
  "ladderpoints2000",
  "ladderpoints4000",
  "ladderpoints8000",
  "ladderpoints16000",
  "ladderpoints32000",
  "ladderpoints64000",
  "ladderpoints125000",
  "ladderpoints250000",
  "ladderpoints500000",
  "ladderpoints1000000",
];

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [savedValue, setSavedValue] = useState<string | null>(null);
  const [showInitQ, setShowInitQ] = useState(true);
  const [usedLifelines, setUsedLifelines] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [highlightedStepIndex, setHighlightedStepIndex] = useState<number | null>(null);
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([]); // <-- NEW: answers hidden by 50/50

  // 🔊 Load sounds
  const correctSound = typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;
  const incorrectSound = typeof Audio !== "undefined" ? new Audio("/sounds/incorrect.mp3") : null;

  const handleClick = () => {
    setSavedValue(inputValue);
    setShowInitQ(false);
    setHighlightedStepIndex(0); // Highlight ladderpoints100 on continue
  };

  const handleLifelineClick = (lifelineId: string) => {
    if (!usedLifelines.includes(lifelineId)) {
      setUsedLifelines([...usedLifelines, lifelineId]);

      if (lifelineId === "l2") {
        // 50/50 lifeline: hide 2 incorrect answers
        const allAnswers = ["a1", "a2", "a3", "a4"];
        const correct = questions[currentQuestionIndex].correct;
        const incorrectAnswers = allAnswers.filter((a) => a !== correct);
        const shuffled = incorrectAnswers.sort(() => 0.5 - Math.random());
        const toHide = shuffled.slice(0, 2);
        setHiddenAnswers(toHide);
      }
    }
  };

  const isUsed = (id: string) => usedLifelines.includes(id);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answerKey: "a1" | "a2" | "a3" | "a4") => {
    if (hiddenAnswers.includes(answerKey)) return; // do nothing if hidden

    if (answerKey === currentQuestion.correct) {
      // ✅ Correct
      correctSound?.play();

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setHighlightedStepIndex((prev) =>
          prev !== null && prev < ladderSteps.length - 1 ? prev + 1 : prev
        );
        setHiddenAnswers([]); // reset hidden answers on next question
      } else {
        alert("🎉 Congrats! You've answered all questions.");
      }
    } else {
      // ❌ Incorrect
      incorrectSound?.play();
      alert("❌ Sorry, that’s not correct. Try again.");
    }
  };

  return (
    <div className="layout">
      <div className="camera">Camera Area</div>

      {showInitQ && (
        <div className="initq">
          <div className="q">Enter the player's name</div>
          <input
            type="text"
            className="init1"
            placeholder="Enter text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div
            className="init2"
            onClick={inputValue ? handleClick : undefined}
            style={{
              cursor: inputValue ? "pointer" : "not-allowed",
              opacity: inputValue ? 1 : 0.5,
            }}
          >
            Continue
          </div>
        </div>
      )}

      {!showInitQ && (
        <div className="qaa">
          <div className="q">{currentQuestion.q}</div>
          {["a1", "a2", "a3", "a4"].map((key) => (
            <div
              key={key}
              className={key}
              onClick={() => handleAnswerClick(key as "a1" | "a2" | "a3" | "a4")}
              style={{
                visibility: hiddenAnswers.includes(key) ? "hidden" : "visible",
                pointerEvents: hiddenAnswers.includes(key) ? "none" : "auto",
                userSelect: "none",
                cursor: hiddenAnswers.includes(key) ? "default" : "pointer",
              }}
            >
              {currentQuestion[key as keyof typeof currentQuestion]}
            </div>
          ))}
        </div>
      )}

      <div className="lifelines">
        <div
          className="l1"
          onClick={() => !isUsed("l1") && handleLifelineClick("l1")}
          style={{
            textDecoration: isUsed("l1") ? "line-through" : "none",
            pointerEvents: isUsed("l1") ? "none" : "auto",
            opacity: isUsed("l1") ? 0.5 : 1,
          }}
        >
          Survey Says
        </div>
        <div
          className="l2"
          onClick={() => !isUsed("l2") && handleLifelineClick("l2")}
          style={{
            textDecoration: isUsed("l2") ? "line-through" : "none",
            pointerEvents: isUsed("l2") ? "none" : "auto",
            opacity: isUsed("l2") ? 0.5 : 1,
          }}
        >
          50/50
        </div>
        <div
          className="l3"
          onClick={() => !isUsed("l3") && handleLifelineClick("l3")}
          style={{
            textDecoration: isUsed("l3") ? "line-through" : "none",
            pointerEvents: isUsed("l3") ? "none" : "auto",
            opacity: isUsed("l3") ? 0.5 : 1,
          }}
        >
          Phone A Friend
        </div>
      </div>

      <div className="ladder">
        {[
          "ladderpoints1000000",
          "ladderpoints500000",
          "ladderpoints250000",
          "ladderpoints125000",
          "ladderpoints64000",
          "ladderpoints32000",
          "ladderpoints16000",
          "ladderpoints8000",
          "ladderpoints4000",
          "ladderpoints2000",
          "ladderpoints1000",
          "ladderpoints500",
          "ladderpoints250",
          "ladderpoints100",
        ].map((cls) => {
          const stepIndex = ladderSteps.indexOf(cls);
          return (
            <div
              key={cls}
              className={cls}
              style={{
                background: highlightedStepIndex === stepIndex ? "orange" : undefined,
              }}
            >
              {{
                ladderpoints1000000: "1,000,000",
                ladderpoints500000: "500,000",
                ladderpoints250000: "250,000",
                ladderpoints125000: "125,000",
                ladderpoints64000: "64,000",
                ladderpoints32000: "32,000",
                ladderpoints16000: "16,000",
                ladderpoints8000: "8,000",
                ladderpoints4000: "4,000",
                ladderpoints2000: "2,000",
                ladderpoints1000: "1,000",
                ladderpoints500: "500",
                ladderpoints250: "250",
                ladderpoints100: "100",
              }[cls]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
