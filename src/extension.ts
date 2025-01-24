import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "qbraid-chat" is now active!');

    let disposable = vscode.commands.registerCommand('qbraid-chat.openChat', () => {
        const panel = vscode.window.createWebviewPanel(
            'qbraid-chat', // Panel ID
            'qBraid Chat', // Panel Title
            vscode.ViewColumn.One, // Show in the first column
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'media')), // Restrict access to the 'media' folder
                ],
            }
        );

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
        const scriptUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js'))
        );
        const styleUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'media', 'style.css'))
        );

        // Replace resource links in the HTML
        const webviewHtml = htmlContent
            .replace(/<script src=".*?script\.js"><\/script>/, `<script src="${scriptUri}"></script>`)
            .replace(/<link rel="stylesheet" href=".*?style\.css"\s*\/?>/, `<link rel="stylesheet" href="${styleUri}" />`);

        // Set the webview's HTML content
        panel.webview.html = webviewHtml;
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
