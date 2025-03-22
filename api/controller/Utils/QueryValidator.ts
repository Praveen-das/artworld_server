import { object, number, string, array, lazy } from "yup";

let request = object({
    p: number().default(1),
    q: string(),
    limit: number().default(10),
    material: array(string()),
    category: string(),
    rating: array(number()),
    discount: array(number()),
    price_range: object({ min: number(), max: number() }),
    orderBy: lazy((obj) => {
        let schema = null
        Object.keys(obj || {})?.forEach(key => {
            schema = object({ [key]: string() })
        })
        return schema || object({ createdAt: string().default('desc') })
    })
})

export default function QueryValidator(qry: any) {
    for (let key in qry) {
        let value = qry[key]

        if (key === 'q') continue
        if (key === 'category') continue
        if (typeof value === 'string')
            qry[key] = JSON.parse(value)
    }

    let options = { stripUnknown: true }
    const query = request.validateSync(qry, options);

    return query
}