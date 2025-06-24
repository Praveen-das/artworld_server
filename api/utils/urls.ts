const isProduction = process.env.NODE_ENV === 'production'

export const CLIENT_URL = isProduction ?
    process.env.CLIENT_URL
    : process.env.LOCAL_CLIENT_URL
