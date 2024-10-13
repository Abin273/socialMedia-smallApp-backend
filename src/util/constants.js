export const JWT_EXPIRY_TIME = "1d";

export const COOKIE_EXPIRY_TIME = new Date( Date.now() + 8 * 24 * 60 * 60 * 1000 ); // 8 days

export const BASE_URL = "/api/v1";

export const SEND_REQUEST_STATUSES = Object.freeze({
    IGNORED: "ignored",
    INTERESTED: "interested",
});

export const REVIEW_REQUEST_STATUSES = Object.freeze({
    ACCEPTED: "accepted",
    REJECTED: "rejected",
});
