'use strict';
import * as vscode from 'vscode';
import * as fr from './FileReplacer';

export function activate(context: vscode.ExtensionContext) {

    interface Commands {
        id: string;
        command: (context: vscode.ExtensionContext) => any;
    }
    let commands: Commands[] = [
        {
            id: 'extension.replaceFileNameWithContent',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.Plain)
        },
        {
            id: 'extension.replaceFileNameWithContentBase64',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.Base64)
        },
        {
            id: 'extension.replaceFileNameWithSha256Hash',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.Sha256)
        },
        {
            id: 'extension.replaceFileNameWithSha1Hash',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.Sha1)
        },
        {
            id: 'extension.replaceFileNameWithMd5Hash',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.Md5)
        },
        {
            id: 'extension.replaceFileNameWithFullPathName',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.FullPath)
        },
        {
            id: 'extension.replaceFileNameWithRelativePathName',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.RelativePath)
        },
        {
            id: 'extension.replaceFileNameWithMimeType',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.MimeType)
        },
        {
            id: 'extension.replaceFileNameWithDataProtocol',
            command: context => fr.FileReplacer.replaceFileNameWith(context, fr.FileReplacerType.DataProtocol)
        }];

    commands.forEach(cmd => {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.id, cmd.command));
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}