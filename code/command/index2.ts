// The base command class defines the common interface for all
// concrete commands.
class Command {
  protected app: Application;
  protected editor: Editor;
  protected backup: string;
  constructor(app: Application, editor: Editor) {
    this.app = app;
    this.editor = editor;
  }
  saveBackUp() {
    this.backup = this.editor.text;
  }
  //命令提供撤回逻辑
  undo() {
    this.editor.text = this.backup;
  }
  execute() {
    console.log('execute from base command')
  }
}
class CopyCommand extends Command {
  preClipboard:string;
  constructor(app: Application, editor: Editor) {
    super(app,editor)
  }
  execute() {
    this.app.clipboard = this.editor.getSelection();
    return false;
  }
}
class CutCommand extends Command {
  constructor(app: Application, editor: Editor) {
    super(app,editor)
  }
  execute() {
    this.saveBackUp();
    this.app.clipboard = this.editor.getSelection();
    this.editor.deleteSelection();
    return true;
  }
}
class PasteCommand extends Command {
  constructor(app: Application, editor: Editor) {
    super(app,editor)
  }
  execute() {
    this.saveBackUp();
    this.editor.replaceSelection(this.app.clipboard);
    return true;
  }
}

class CommandHistory {
  private history: Command[];
  constructor() {
    this.history = [];
  }
  push(c: Command) {
    this.history.push(c);
  }
  pop() {
    return this.history.pop();
  }
}
class Editor {
  text: string;
  constructor(text:string) {
    this.text = text;
  }
  getSelection() {
    console.log("getSelection");
    return this.text;
  }
  deleteSelection() {
    console.log("deleteSelection");
    this.text = "";
  }
  replaceSelection(str: string) {
    console.log("replaceSelection");
    this.text = str;
  }
}

class Application {
  clipboard: string;
  activeEditor: Editor;
  history: CommandHistory;
  constructor(editor: Editor) {
    this.clipboard = "";
    this.activeEditor = editor;
    this.history = new CommandHistory();
  }
  executeCommand(c: Command) {
    this.history.push(c);
    c.execute();
  }
  undo() {
    const command = this.history.pop();
    if (command != null) command.undo();
  }
  copy() {
    this.executeCommand(new CopyCommand(this, this.activeEditor));
  }
  cut() {
    this.executeCommand(new CutCommand(this, this.activeEditor));
  }
  paste() {
    this.executeCommand(new PasteCommand(this, this.activeEditor));
  }
}
const editor = new Editor('default text')
const app = new Application(editor);
console.log(editor.text);//default text
app.clipboard = 'new value';
app.paste();
console.log(editor.text);//new value
app.cut();
console.log(editor.text);//''

//开始撤回
app.undo();
console.log(editor.text);//new value
app.undo();
console.log(editor.text);//defalut text