import { PrismaClient } from "@prisma/client";
import { tmpdir } from 'os'
import fs from 'fs'

// declare global {
//     var prisma: PrismaClient;
// }

// let client: PrismaClient

// // const DATABASE_URL = `${process.env.DATABASE_URL}?sslmode=require&sslcert=${tmpdir()}/ca.pem`

// if (!global.prisma) {
    //     fs.writeFile(
//         `${tmpdir()}/ca.pem`,
//         process.env.CLIENT_CERTIFICATE!,
//         err => {
//             if (err) return console.log(err)
//         }
//     )
//     global.prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });
// }

// client = global.prisma

const DATABASE_URL = `${process.env.DATABASE_URL}`

const client = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

export default client