import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { execSync, spawn } from "child_process";
import ky from "ky";
import { encode, isWithinTokenLimit, decode } from "gpt-tokenizer";
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY; // Replace with your actual API key
const systemMessage = `You are a commit message generator by creating exactly one commit message by the diff strings without adding unnecessary information! Here is the format of a good commit message from https://karma-runner.github.io/6.4/dev/git-commit-msg.html guides:

---
<emoji> <type>(<scope>): <subject>
<body>
---

With allowed <type> values are feat, fix, perf, docs, style, refactor, test, and build. And here's an example of a good commit message:

---
😆 fix(middleware): ensure Range headers adhere more closely to RFC 2616
Add one new dependency, use \`range-parser\` (Express dependency) to compute range. It is more well-tested in the wild.
---

git diff:`;
const genAI = new GoogleGenerativeAI(API_KEY);
async function listModel() {
  const response = await ky
    .get(
      "https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY,
    )
    .json();
  return response;
}
function deleteLastLine(text) {
  // 1. Split the text into lines:
  const lines = text.split("\n");

  // 2. Remove the last line:
  lines.pop(); //  Bye-bye, last line!

  // 3. Join the remaining lines back into a string:
  const modifiedText = lines.join("\n");
  return modifiedText;
}
function deleteLinesFromStart(text, lastLineNumber) {
  const lines = text.split("\n");

  lines.splice(lastLineNumber, lines.length + 1); // Remove lines from the beginning (inclusive)

  return lines.join("\n");
}
function delay(delayInMilliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(); // Resolve the Promise after the delay
    }, delayInMilliseconds);
  });
}
async function gitDiffStaged() {
  const child = spawn("git", ["diff", "--staged"]);

  const output = await new Promise((resolve, reject) => {
    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Git command failed with exit code ${code}`));
      }
    });
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });
  });

  return output;
}
async function run() {
  try {
    const allModel = await listModel();
    const geminiProTokenLimit = allModel.models[3].inputTokenLimit;
    execSync(`cd ../../ && bash add-first-untracked.sh`);
    const diffString = await gitDiffStaged();
    if (!diffString.trim()) {
      throw { status: 5001, message: "No changes to commit" };
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let modifiedDiffString = diffString;
    let modifiedPrompt = `${systemMessage}
        ${modifiedDiffString}
        `;

    const result = await model.generateContent(modifiedPrompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    //            execSync(`git reset`);
    execSync(`git add -A`);
    execSync(`printf "${text.replace(/\`/gi, "\\`")}" | git commit -F-`);
    execSync("git push -u origin HEAD");
    process.exit();
  } catch (e) {
    console.log(e.message);
    execSync(`git reset`);
    process.exit();
  }
}

run();
