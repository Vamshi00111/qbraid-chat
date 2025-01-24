import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "qbraid-chat" is now active!');

    // Register the command that opens the chat UI
    let disposable = vscode.commands.registerCommand('qbraid-chat.openChat', () => {
        // Create a new webview panel
        const panel = vscode.window.createWebviewPanel(
            'qbraid-chat', // Panel ID
            'qBraid Chat', // Panel Title
            vscode.ViewColumn.One, // Show in the first column
            {
                enableScripts: true, // Allow JavaScript in the webview
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))] // Allow access to local resources
            }
        );

        // Path to the index.html file inside the media folder
        const indexHtmlPath = path.join(context.extensionPath, 'media', 'index.html');
        const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

        // Replace local resource links with webview-compatible URIs
        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js')));
        const styleUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'style.css')));

        // Update the HTML content with resource links for webview
        const webviewHtml = htmlContent
            .replace(/<script src="script\.js"><\/script>/, `<script src="${scriptUri}"></script>`)
            .replace(/<link rel="stylesheet" href="style\.css" \/>/, `<link rel="stylesheet" href="${styleUri}" />`);

        // Set the webview's HTML content
        panel.webview.html = webviewHtml;
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
