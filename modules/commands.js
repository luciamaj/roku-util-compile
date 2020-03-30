function executeCmd(cmd) {
    switch (cmd) {
        case "spegni-macchina":
            cecDisplayOff();
            break;
        default:
            console.log("comando non riconosciuto", cmd);
    }
}

function cecDisplayOff() {
    console.log("### cecDisplayOff ###");
    var cec_control = new BSCECTransmitter();
    var buffer = new Uint8Array(2);
    buffer[ 0 ] = 0x40;
    buffer[ 1 ] = 0x36;
    cec_control.SendRawMessage(buffer);
}

exports.executeCmd = executeCmd;