const spinnerFrames = ["◐", "◓", "◑", "◒"];
let frameIndex = 0;
let spinnerInterval: number | null = null;

// Start the spinner animation
export function startSpinner() {
    if (spinnerInterval !== null) {
        clearInterval(spinnerInterval);
    }
    spinnerInterval = setInterval(() => {
        Deno.stdout.writeSync(
            new TextEncoder().encode(`\r${spinnerFrames[frameIndex++ % spinnerFrames.length]} Searching on Web...`),
        );
    }, 100);
}

// Stop the spinner animation
export function stopSpinner() {
    if (spinnerInterval !== null) {
        clearInterval(spinnerInterval);
        spinnerInterval = null;
        Deno.stdout.writeSync(new TextEncoder().encode("\rDone! Searching complete.\n"));
    }
}
