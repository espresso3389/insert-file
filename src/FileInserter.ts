import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export enum FileInsertionMode
{
    Plain,
    Base64
}

let quotePairs = [
    ['"', '"'],
    ['\'', '\''],
    ['(', ')'],
    ['[', ']']
];

export class FileInserter
{
    public static insertFile(context: vscode.ExtensionContext, mode: FileInsertionMode) : void {
        let textEditor = vscode.window.activeTextEditor;
        textEditor.edit(editor => {
            textEditor.selections.forEach(s => {
                let fn = FileInserter.parseFileNameAndMakePretty(textEditor.document.getText(s), path.dirname(textEditor.document.fileName));
                if (fn) {
                    let replacement = FileInserter.getFileContents(fn, mode);
                    if (replacement)
                        editor.replace(s, replacement);
                }
            });
        });
    }

    static getFileContents(filePath: string, mode: FileInsertionMode) : string {
        try {
            let buf = fs.readFileSync(filePath);
            if (buf.length > 10 * 1024 * 1024) {
                vscode.window.showErrorMessage('File too large (' + buf.length + ' bytes): ' + filePath);
                return null;
            }
            return buf.toString(mode == FileInsertionMode.Plain ? FileInserter.getEncoding() : 'base64');
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
        return null;
    }

    static getEncoding() : string {
        let configuration = vscode.workspace.getConfiguration("espresso3389.insert-file");
        let setValue = configuration.get<string>("encoding");
        return setValue != "" ? setValue : "utf-8";
    }

    static parseFileNameAndMakePretty(fileName: string, curDir: string) : string {
        fileName = FileInserter.parseFileName(fileName);
        if (!path.isAbsolute(fileName))
            fileName = path.join(curDir, fileName);
        if (fs.existsSync(fileName))
            return fileName;
        return null;
    }

    static parseFileName(fileName: string) : string {
        for (let i = 0; i < quotePairs.length; i++) {
            let q = quotePairs[i];
            if (fileName.startsWith(q[0]) && fileName.endsWith(q[1])) {
                return fileName.slice(q[0].length, -q[1].length);
            }
        }
        return fileName;
    }
}