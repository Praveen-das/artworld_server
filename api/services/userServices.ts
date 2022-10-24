import db from '../config/prismaClient'

const _createUser = async(credentials:any) => {
    const data = await db.user.create({
        data:credentials
    })
    return data
};

export {
    _createUser
}
