const vscode = require('vscode');

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = function(context) {
    let languageIdObj = {}
    // 注册命令
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.enable', function (uri) {
        const csLanguageId = 'clear-silver'
        let textDocument = uri.document
        
        if (!languageIdObj[textDocument.fileName]) {
            if (textDocument.languageId !== csLanguageId) {
                vscode.languages.setTextDocumentLanguage(textDocument, csLanguageId)
                languageIdObj[textDocument.fileName] = textDocument.languageId
            } else {
                return
            }
        } else {
            if (textDocument.languageId === csLanguageId) {
                vscode.languages.setTextDocumentLanguage(textDocument, languageIdObj[textDocument.fileName])
                languageIdObj[textDocument.fileName] = ''
            } else {
                vscode.languages.setTextDocumentLanguage(textDocument, csLanguageId)
                languageIdObj[textDocument.fileName] = textDocument.languageId
            }
        }
    }));
};

/**
 * 插件被释放时触发
 */
exports.deactivate = function() {
    // console.log('您的扩展“vscode-plugin-demo”已被释放！')
};