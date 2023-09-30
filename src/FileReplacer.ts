"use strict";

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

let mime = require("mime-type/with-db");

export enum FileReplacerType {
  Plain,
  Base64,
  Sha256,
  Sha1,
  Md5,
  FullPath,
  RelativePath,
  MimeType,
  DataProtocol,
}

let quotePairs = [
  ['"', '"'],
  ["'", "'"],
  ["(", ")"],
  ["[", "]"],
];

export class FileReplacer {
  public static replaceFileNameWith(
    context: vscode.ExtensionContext,
    repr: FileReplacerType
  ): void {
    const textEditor = vscode.window.activeTextEditor;
    const wsFolder =
      vscode.workspace.getWorkspaceFolder(textEditor.document.uri) ??
      vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0]
        : undefined;
    if (!wsFolder) {
      vscode.window.showErrorMessage("Could not determine workspace folder.");
      return undefined;
    }

    textEditor.edit((editor) => {
      textEditor.selections.forEach((s) => {
        let range = FileReplacer.conditionFileNameRange(s, textEditor);
        let fn = path.normalize(
          path.join(wsFolder.uri.fsPath, textEditor.document.getText(range))
        );

        let replacement: string = null;
        if (repr == FileReplacerType.FullPath) replacement = fn;
        else if (repr == FileReplacerType.RelativePath)
          replacement = path.relative(wsFolder.uri.fsPath, fn);
        else if (repr == FileReplacerType.MimeType)
          replacement = mime.lookup(path.extname(fn));
        else {
          if (!fs.existsSync(fn)) {
            vscode.window.showErrorMessage(`File not found: ${fn}`);
            return undefined;
          }
          replacement = FileReplacer.getFileContents(fn, repr);
        }
        if (replacement) editor.replace(range, replacement);
      });
    });
  }

  static getFileContents(
    filePath: string,
    repr: FileReplacerType
  ): string | undefined {
    try {
      let buf = fs.readFileSync(filePath);
      if (buf.length > 10 * 1024 * 1024) {
        vscode.window.showErrorMessage(
          `File too large (${buf.length} bytes): ${filePath}`
        );
        return undefined;
      }
      if (repr == FileReplacerType.Plain || repr == FileReplacerType.Base64)
        return buf.toString(
          repr == FileReplacerType.Plain ? FileReplacer.getEncoding() : "base64"
        );
      else if (repr == FileReplacerType.DataProtocol)
        return (
          "data:" +
          mime.lookup(path.extname(filePath)) +
          ";base64," +
          buf.toString("base64")
        );
      let hash: crypto.Hash = null;
      if (repr == FileReplacerType.Sha256) hash = crypto.createHash("sha256");
      if (repr == FileReplacerType.Sha1) hash = crypto.createHash("sha1");
      if (repr == FileReplacerType.Md5) hash = crypto.createHash("md5");
      if (hash) return hash.update(buf).digest().toString("hex");
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
    return undefined;
  }

  static getEncoding(): BufferEncoding {
    let configuration = vscode.workspace.getConfiguration(
      "espresso3389.insert-file"
    );
    let setValue = configuration.get<string>("encoding");
    return setValue != "" ? (setValue as BufferEncoding) : "utf-8";
  }

  static parseFileNameAndMakePretty(fileName: string, curDir: string): string {
    if (!path.isAbsolute(fileName)) fileName = path.join(curDir, fileName);
    if (fs.existsSync(fileName)) return fileName;
    return null;
  }

  static conditionFileNameRange(
    selection: vscode.Selection,
    textEditor: vscode.TextEditor
  ): vscode.Range {
    let fileName = textEditor.document.getText(selection);
    for (const q of quotePairs) {
      if (fileName.startsWith(q[0]) && fileName.endsWith(q[1]))
        return FileReplacer.offsetRange(
          selection,
          q[0].length,
          -q[1].length,
          textEditor
        );
    }
    return selection;
  }

  static offsetRange(
    range: vscode.Range,
    startOffset: number,
    endOffset: number,
    textEditor: vscode.TextEditor
  ): vscode.Range {
    return new vscode.Range(
      FileReplacer.offsetPosition(range.start, startOffset, textEditor),
      FileReplacer.offsetPosition(range.end, endOffset, textEditor)
    );
  }

  static offsetPosition(
    pos: vscode.Position,
    offset: number,
    textEditor: vscode.TextEditor
  ): vscode.Position {
    return textEditor.document.positionAt(
      textEditor.document.offsetAt(pos) + offset
    );
  }
}
