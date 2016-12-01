'use strict';
import * as vscode from 'vscode';
import * as fsi from './FileInserter';

export function activate(context: vscode.ExtensionContext) {

    interface Commands {
        id: string;
        command: (context: vscode.ExtensionContext) => any;
    }
    let commands: Commands[] = [
        {
            id: 'extension.replaceFileNameWithItsContent',
            command: context => fsi.FileInserter.insertFile(context, fsi.FileInsertionMode.Plain)
        },
        {
            id: 'extension.replaceFileNameWithItsContentBase64',
            command: context => fsi.FileInserter.insertFile(context, fsi.FileInsertionMode.Base64)
        }
    ];

    commands.forEach(cmd => {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.id, cmd.command));
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}