// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import ts from "typescript";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const removeCommentsHandler = () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return vscode.window.showErrorMessage("No active file found.");
    }
    const document = editor.document;
    const text = document.getText();

    let inCommentBlock = false;
    const cleanedText = text
      .split("\n")
      .filter((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("/*") || trimmedLine.startsWith("{/*")) {
          inCommentBlock = true;
        }
        if (trimmedLine.endsWith("*/") || trimmedLine.endsWith("*/}")) {
          inCommentBlock = false;
          return false;
        }
        return !inCommentBlock && !trimmedLine.startsWith("//");
      })
      .join("\n");

    editor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        ),
        cleanedText
      );
    });
  };

  const removeConsolLogsHandler = () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return vscode.window.showErrorMessage("No active file found.");
    }
    const document = editor.document;
    const text = document.getText();

    const consoleLogRegex = /console\.log\(([\s\S]*?)\);?/g;
    const cleanedText = text.replace(consoleLogRegex, "");

    editor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        ),
        cleanedText
      );
    });
  };

  const removeUnusedImportsHandler = () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return vscode.window.showErrorMessage("No active file found.");
    }
    const document = editor.document;
    const text = document.getText();

    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.ESNext,
      true
    );

    const imports: { name: string; isDefault: boolean; many: boolean }[] = [];
    const usedIdentifiers: string[] = [];

    ts.forEachChild(sourceFile, function visit(node) {
      if (ts.isImportDeclaration(node)) {
        const importClause = node.importClause;
        if (importClause) {
          if (
            importClause.name &&
            (!importClause.name.text.startsWith("//") ||
              !importClause.name.text.startsWith("/*"))
          ) {
            imports.push({
              name: importClause.name.text,
              isDefault: true,
              many: false,
            });
          } else if (
            importClause.namedBindings &&
            ts.isNamedImports(importClause.namedBindings)
          ) {
            const elements: ts.NodeArray<ts.ImportSpecifier> =
              importClause.namedBindings.elements;
            elements.forEach((element) => {
              if (
                !element.name.text.startsWith("//") ||
                !element.name.text.startsWith("/*")
              ) {
                imports.push({
                  name: element.name.text,
                  isDefault: false,
                  many: elements.length > 1,
                });
              }
            });
          }
        }
      } else if (ts.isIdentifier(node) && node.parent.kind) {
        usedIdentifiers.push(node.text);
      }
      ts.forEachChild(node, visit);
    });

    console.log("Imports:", imports);

    const unusedImports = imports.filter(
      (imp) =>
        usedIdentifiers.filter((identifier) => identifier === imp.name).length <
        2
    );

    console.log("Unused Imports:", unusedImports);

    const cleanedText = text
      .split("\n")
      .map((line) => {
        let modifiedLine = line;

        unusedImports.forEach((unusedImport) => {
          if (line.includes(unusedImport.name)) {
            if (unusedImport.isDefault) {
              modifiedLine = "";
            } else {
              if (unusedImport.many) {
                modifiedLine = modifiedLine.replace(
                  new RegExp(`, ${unusedImport.name}`, "g"),
                  ""
                );
              } else {
                modifiedLine = "";
              }
            }
          }
        });

        return modifiedLine;
      })
      .join("\n");

    editor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        ),
        cleanedText
      );
    });
  };

  const cleanCodeHandler = () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return vscode.window.showErrorMessage("No active file found.");
    }

    const document = editor.document;
    const text = document.getText();

    let inCommentBlock = false;
    const cleanedTextWithoutComments = text
      .split("\n")
      .filter((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("/*") || trimmedLine.startsWith("{/*")) {
          inCommentBlock = true;
        }
        if (trimmedLine.endsWith("*/") || trimmedLine.endsWith("*/}")) {
          inCommentBlock = false;
          return false;
        }
        return !inCommentBlock && !trimmedLine.startsWith("//");
      })
      .join("\n");

    const consoleLogRegex = /console\.log\([^)]*\);?/g;
    const cleanedTextWithoutConsoleLogs = cleanedTextWithoutComments.replace(
      consoleLogRegex,
      ""
    );

    const sourceFile = ts.createSourceFile(
      document.fileName,
      cleanedTextWithoutConsoleLogs,
      ts.ScriptTarget.ESNext,
      true
    );

    const imports: { name: string; isDefault: boolean; many: boolean }[] = [];
    const usedIdentifiers: string[] = [];

    ts.forEachChild(sourceFile, function visit(node) {
      if (ts.isImportDeclaration(node)) {
        const importClause = node.importClause;
        if (importClause) {
          if (
            importClause.name &&
            (!importClause.name.text.startsWith("//") ||
              !importClause.name.text.startsWith("/*"))
          ) {
            imports.push({
              name: importClause.name.text,
              isDefault: true,
              many: false,
            });
          } else if (
            importClause.namedBindings &&
            ts.isNamedImports(importClause.namedBindings)
          ) {
            const elements: ts.NodeArray<ts.ImportSpecifier> =
              importClause.namedBindings.elements;
            elements.forEach((element) => {
              if (
                !element.name.text.startsWith("//") ||
                !element.name.text.startsWith("/*")
              ) {
                imports.push({
                  name: element.name.text,
                  isDefault: false,
                  many: elements.length > 1,
                });
              }
            });
          }
        }
      } else if (ts.isIdentifier(node) && node.parent.kind) {
        usedIdentifiers.push(node.text);
      }
      ts.forEachChild(node, visit);
    });

    const unusedImports = imports.filter(
      (imp) =>
        usedIdentifiers.filter((identifier) => identifier === imp.name).length <
        2
    );

    console.log("Unused Imports:", unusedImports);

    const cleanedText = cleanedTextWithoutConsoleLogs
      .split("\n")
      .map((line) => {
        let modifiedLine = line;
        unusedImports.forEach((unusedImport) => {
          if (line.includes(unusedImport.name)) {
            if (unusedImport.isDefault) {
              modifiedLine = "";
            } else {
              if (unusedImport.many) {
                modifiedLine = modifiedLine.replace(
                  new RegExp(`, ${unusedImport.name}`, "g"),
                  ""
                );
              } else {
                modifiedLine = "";
              }
            }
          }
        });

        return modifiedLine;
      })
      .join("\n");

    editor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        ),
        cleanedText
      );
    });
  };

  const removeUnusedImports = vscode.commands.registerCommand(
    "clean-code.removeUnusedImports",
    removeUnusedImportsHandler
  );

  const removeComments = vscode.commands.registerCommand(
    "clean-code.removeComments",
    removeCommentsHandler
  );

  const removeConsoleLogs = vscode.commands.registerCommand(
    "clean-code.removeConsoleLogs",
    removeConsolLogsHandler
  );

  const cleanCode = vscode.commands.registerCommand(
    "clean-code.cleanCode",
    cleanCodeHandler
  );

  context.subscriptions.push(
    removeComments,
    removeConsoleLogs,
    removeUnusedImports,
    cleanCode
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
