import allowedOrigins from "./allowedOrigins"

const corsOptions = {
    origin:
        (origin: any, callback: any) => {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                return callback(false)
            }
        },
    credentials: true,
}

export default corsOptions