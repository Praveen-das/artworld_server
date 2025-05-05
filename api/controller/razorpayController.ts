import { _createLinkedAccount, _createOrder, _getLinkedAccounts, _verify } from "../services/razorpayServices";
import { _getUserById, _updateUser } from "../services/userServices";
import { } from 'razorpay'

function createOrder(req: any, res: any, next: any) {
    _createOrder()
        .then(response => res.json(response))
        .catch(err => res.send(err))
}

async function verify(req: any, res: any, next: any) {
    const userId = req.user.id;

    _verify(userId, req.body)
        .then(response => res.redirect('http://localhost:3000/seller/onboarding'))
        .catch(err => res.redirect('http://localhost:3000/seller/failed'))
}

async function createLinkedAccount(req: any, res: any, next: any) {
    let payload = {
        userId: req.user.id,
        ...req.body
    }
    
    _createLinkedAccount(payload)
        .then(response => res.json(response.data))
        .catch(err => res.status(400).send(err.response.data))
}

async function getLinkedAccounts(req: any, res: any, next: any) {
    _getLinkedAccounts()
        .then(response => res.json(response))
        .catch(err => res.json(err))
}

export default {
    createOrder,
    verify,
    createLinkedAccount,
    getLinkedAccounts
}