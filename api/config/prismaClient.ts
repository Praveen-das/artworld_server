import { PrismaClient } from "@prisma/client";
import { tmpdir } from 'os'
import fs from 'fs'

declare global {
    var prisma: PrismaClient;
}

let client: PrismaClient
console.log(`${tmpdir()}/ca.pem`);

if (!global.prisma) {
    fs.writeFile(
        `${tmpdir()}/ca.pem`,
        process.env.CLIENT_CERTIFICATE!,
        err => {
            if (err) return console.log(err)
        }
    )
    global.prisma = new PrismaClient();
}

client = global.prisma

export default client