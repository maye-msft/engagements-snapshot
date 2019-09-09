export default {
  confirm: function (cb) {
    const {dialog} = require('electron').remote

    const dialogOptions = {type: 'info', buttons: ['OK', 'Cancel'], message: 'Please confirm to clear.'}

    dialog.showMessageBox(dialogOptions, i => { if (i === 0) { cb() } })
  }
}
