import { emptyPageText } from "./script.js";

export function hideEmptyPageText() {
    emptyPageText.style.transform = "translate(-50%,-50%) scale(0)";
}
  
export function showEmptyPageText() {
    const emptyPageTexts = [
      "Focus on being productive instead of busy.",
      "Do the hard jobs first. The easy jobs will take care of themselves.",
      "Productivity is being able to do things that you were never able to do before.",
      "It’s not always that we need to do more but rather that we need to focus on less.",
      "My goal is no longer to get more done, but rather to have less to do.",
      "Strive not to be a success, but rather to be of value.",
      "Sometimes, things may not go your way, but the effort should be there every single night.",
      "The tragedy in life doesn’t lie in not reaching your goal. The tragedy lies in having no goal to reach.",
      "If you spend too much time thinking about a thing, you’ll never get it done.",
      "Until we can manage time, we can manage nothing else.",
      "The way to get started is to quit talking and begin doing.",
      "You don’t need a new plan for next year. You need a commitment.",
      "It’s not that I’m so smart, it’s just that I stay with problems longer.",
      "Lost time is never found again.",
      "Action is the foundational key to all success.",
      "Efficiency is doing things right. Effectiveness is doing the right things.",
      "We have a strategic plan. It’s called doing things.",
      "If there are nine rabbits on the ground, if you want to catch one, just focus on one.",
      "Efficiency is doing better what is already being done.",
      "Absorb what is useful, reject what is useless, add what is specifically your own.",
    ];
    let randomIndex = Math.floor(Math.random() * emptyPageTexts.length);
    emptyPageText.querySelector("p").innerHTML = `"${emptyPageTexts[randomIndex]}"`;
    emptyPageText.style.transform = "translate(-50%,-50%) scale(1)";
}