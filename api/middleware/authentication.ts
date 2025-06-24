import { Request, Response, NextFunction } from 'express'
import { SERVER_URL } from '../utils/urls';

export function WWWAuthentication(req: any, res: any, next: any) {
    const authheader = req.headers.authorization;
    const site = req.get("Sec-Fetch-Site")
    if (site !== 'none') return next()

    if (!authheader) return handleAuthenticationFailureResponse(req, res)

    const [_, token]: [string, string] = authheader.split(' ')

    let auth: string[] = decodeBaseAuthToken(token)

    let username = auth[0],
        password = auth[1];

    if (!validCredentials(username, password))
        return handleAuthenticationFailureResponse(req, res, 'Authentication failed')

    next()
}

function handleAuthenticationFailureResponse(req: any, res: any, err?: string) {
    const status = 401;
    const error = {
        code: "BAD_REQUEST_ERROR",
        description: err ? err : "Authentication required"
    }


    return res
        .status(status)
        .setHeader('WWW-Authenticate', 'Basic realm="Artworld"')
        .send(error)
}

function decodeBaseAuthToken(token: string): string[] {
    return atob(token).split(':');
}

function validCredentials(username: string, password: string) {
    return username === 'admin' && password === 'password'
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        res.header("Access-Control-Allow-Origin", SERVER_URL);
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        return next()
    }
    return res.send(null)
} 
