"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    console.log('Congratulations, your extension "qbraid-chat" is now active!');
    let disposable = vscode.commands.registerCommand('qbraid-chat.openChat', () => {
        const panel = vscode.window.createWebviewPanel('qbraid-chat', // Panel ID
        'qBraid Chat', // Panel Title
        vscode.ViewColumn.One, // Show in the first column
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'media')), // Restrict access to the 'media' folder
            ],
        });
        // Path to index.html file
        const indexHtmlPath = path.join(context.extensionPath, 'media', 'index.html');
        // Check if the file exists to avoid errors
        if (!fs.existsSync(indexHtmlPath)) {
            vscode.window.showErrorMessage('Unable to load the chat UI. index.html not found.');
            return;
        }
        // Read the index.html content
        const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
        // Resolve the URIs for script.js and style.css
        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js')));
        const styleUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'style.css')));
        // Replace resource links in the HTML
        const webviewHtml = htmlContent
            .replace(/<script src=".*?script\.js"><\/script>/, `<script src="${scriptUri}"></script>`)
            .replace(/<link rel="stylesheet" href=".*?style\.css"\s*\/?>/, `<link rel="stylesheet" href="${styleUri}" />`);
        // Set the webview's HTML content
        panel.webview.html = webviewHtml;
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
