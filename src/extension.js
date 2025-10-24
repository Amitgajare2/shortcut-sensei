const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const tipsPath = path.join(context.extensionPath, "data", "tips.json");
  const tipsData = JSON.parse(fs.readFileSync(tipsPath, "utf8"));

  // Helper function to show a tip
  const showTip = (item) => {
    vscode.window.showInformationMessage(`💡 ${item.title}: ${item.tip}`);
  };

  // Random tip
  const randomTip = vscode.commands.registerCommand("shortcutSensei.showRandomTip", () => {
    const allTips = [...tipsData.keyboardShortcuts, ...tipsData.emmetTricks];
    const random = allTips[Math.floor(Math.random() * allTips.length)];
    showTip(random);
  });

  // Sequential Learning (Mixed)
  const startLearning = vscode.commands.registerCommand("shortcutSensei.startLearning", async () => {
    let progress = context.globalState.get("learningProgress", 0);
    const allTips = [...tipsData.keyboardShortcuts, ...tipsData.emmetTricks];

    if (progress >= allTips.length) {
      vscode.window.showInformationMessage("🎉 You've completed all tips! Reset progress to start over.");
      return;
    }

    const item = allTips[progress];
    const next = await vscode.window.showInformationMessage(
      `📘 [${progress + 1}/${allTips.length}] ${item.title}: ${item.tip}`,
      "Next", "Reset Progress"
    );

    if (next === "Next") {
      progress++;
      context.globalState.update("learningProgress", progress);
      vscode.commands.executeCommand("shortcutSensei.startLearning");
    } else if (next === "Reset Progress") {
      context.globalState.update("learningProgress", 0);
      vscode.window.showInformationMessage("🔄 Progress reset!");
    }
  });

  // Only keyboard shortcuts
  const learnShortcuts = vscode.commands.registerCommand("shortcutSensei.learnShortcuts", async () => {
    let progress = context.globalState.get("keyboardProgress", 0);
    const tips = tipsData.keyboardShortcuts;

    if (progress >= tips.length) {
      vscode.window.showInformationMessage("✅ You’ve learned all keyboard shortcuts!");
      return;
    }

    const item = tips[progress];
    const next = await vscode.window.showInformationMessage(
      `⌨️ [${progress + 1}/${tips.length}] ${item.title}: ${item.tip}`,
      "Next", "Reset Progress"
    );

    if (next === "Next") {
      context.globalState.update("keyboardProgress", progress + 1);
      vscode.commands.executeCommand("shortcutSensei.learnShortcuts");
    } else if (next === "Reset Progress") {
      context.globalState.update("keyboardProgress", 0);
      vscode.window.showInformationMessage("🔄 Keyboard progress reset!");
    }
  });

  // Only Emmet tricks
  const learnEmmet = vscode.commands.registerCommand("shortcutSensei.learnEmmet", async () => {
    let progress = context.globalState.get("emmetProgress", 0);
    const tips = tipsData.emmetTricks;

    if (progress >= tips.length) {
      vscode.window.showInformationMessage("✅ You’ve learned all Emmet tricks!");
      return;
    }

    const item = tips[progress];
    const next = await vscode.window.showInformationMessage(
      `🚀 [${progress + 1}/${tips.length}] ${item.title}: ${item.tip}`,
      "Next", "Reset Progress"
    );

    if (next === "Next") {
      context.globalState.update("emmetProgress", progress + 1);
      vscode.commands.executeCommand("shortcutSensei.learnEmmet");
    } else if (next === "Reset Progress") {
      context.globalState.update("emmetProgress", 0);
      vscode.window.showInformationMessage("🔄 Emmet progress reset!");
    }
  });

  context.subscriptions.push(randomTip, startLearning, learnShortcuts, learnEmmet);
}

function deactivate() {}

module.exports = { activate, deactivate };
