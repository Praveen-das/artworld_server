import services from "../Services/cartServices";

const {
    _fetchUserCart,
    _addToCart,
    _removeFromCart,
    _updateCart,
    _clearUserCart
} = services

const fetchUserCart = (req: any, res: any, next: any) => {
    const user_id = req.user?.id
    if (!user_id) return res.json([])

    _fetchUserCart(user_id)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

const addToCart = (req: any, res: any, next: any) => {
    const user_id = req.user?.id
    const data = req.body
    data['user_id'] = user_id

    _addToCart(data)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

const removeFromCart = (req: any, res: any, next: any) => {
    const cart_id = req.params.id

    _removeFromCart(cart_id)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

const updateCart = (req: any, res: any, next: any) => {
    const cart_id = req.params.id
    const updates = req.body

    _updateCart(cart_id, updates)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

const clearUserCart = (req: any, res: any, next: any) => {
    const userId = req.user.userId

    _clearUserCart(userId)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

export default {
    fetchUserCart,
    addToCart,
    removeFromCart,
    updateCart,
    clearUserCart
}