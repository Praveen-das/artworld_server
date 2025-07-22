import { PrismaClient } from "@prisma/client";
import { tmpdir } from 'os'

import fs from 'fs'

fs.writeFile(
    `${tmpdir()}/ca.pem`,
    process.env.DATABASE_URL!,
    err => {
        if (err) return console.log(err)
    }
)

const client = new PrismaClient();

export default client