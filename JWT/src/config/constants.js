const REQUEST_LIMITS = {
    RATE_LIMIT_DURATION_MS: 10 * 60 * 1000,
    MAX_REQUESTS_PER_WINDOW: 50,
    MESSAGE: "Too many requests, please try again later."
}

const DEVELOPMENT = {
    PORT: 3000
}

module.exports = { REQUEST_LIMITS, DEVELOPMENT }