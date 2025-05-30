export function stripAnsiCodes(text) {
  // Remove all ANSI escape sequences
  return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') // CSI sequences
             .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '') // OSC sequences
             .replace(/\x1b./g, ''); // Other escape sequences
}