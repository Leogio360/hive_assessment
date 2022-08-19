// Initialize the agent at application startup.
const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
.then(FingerprintJS => FingerprintJS.load())
