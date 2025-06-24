const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isStaging = process.env.NODE_ENV === 'staging'

export const SERVER_URL = isProduction ?
    process.env.CLIENT_URL
    : process.env.LOCAL_CLIENT_URL
