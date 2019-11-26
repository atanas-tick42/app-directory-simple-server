const path = require('path');
const execFile = require('child_process').execFile;

let dirname = path.dirname(process.argv[1])
let appdPath = path.join(dirname, 'appd-server.exe');
let roleEditorPath = path.join(dirname, 'role-editor.exe');

let server = execFile(appdPath);
server.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});
server.stderr.on('data', (data) => {
  console.log(data.toString().trim())
})

let roleEditor = execFile(roleEditorPath);
roleEditor.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});
roleEditor.stderr.on('data', (data) => {
  console.log(data.toString().trim())
})