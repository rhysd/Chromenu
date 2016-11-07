export default function setupLaunchctl() {
    if (process.platform !== 'darwin') {
        console.error('launchctl is only available for macOS. Please manually setup auto-launch on Windows or Linux');
        return 201;
    }
    console.error('Not implemented yet');
    return 202;
}
