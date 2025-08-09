const isProduction = process.env.NODE_ENV === 'production'

// const HOST_DOMAIN = process.env.ARTWORLD_HOST_DOMAIN || 'localhost'
// export const CLIENT_URL = `http://${HOST_DOMAIN}:3000`
export const CLIENT_URL = isProduction ?
    process.env.CLIENT_URL
    : process.env.LOCAL_CLIENT_URL