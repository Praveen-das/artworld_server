import {
  _fetchProducts,
  _fetchAdminProducts,
  _addProduct,
  _removeProduct,
  _updateProduct,
  _searchProduct,
  _fetchProductById,
  _fetchFilterParams,
  _fetchCategories,
} from "../services/productServices";
import QueryValidator from './Utils/QueryValidator'

const fetchProducts = (req: any, res: any, next: any) => {
  let query = QueryValidator(req.query)

  _fetchProducts(query)
    .then((data) => res.send(data))
    .catch(next);
};

const fetchFilterParams = (req: any, res: any, next: any) => {  
  let query = QueryValidator(req.query)

  _fetchFilterParams(query)
    .then((data) => res.send(data))
    .catch(next);
};

const fetchCategories = (req: any, res: any, next: any) => {  
  let query = QueryValidator(req.query)

  _fetchCategories(query)
    .then((data) => res.send(data))
    .catch(next);
};

const fetchAdminProducts = (req: any, res: any, next: any) => {
  let query = QueryValidator(req.query)
  
  const userId = req.user?.id || null

  _fetchAdminProducts(userId, query)
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const fetchProductById = (req: any, res: any, next: any) => {
  const id = req.params.id;

  _fetchProductById(id)
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const searchProductByName = (req: any, res: any, next: any) => {
  const query = req.query;
  _searchProduct(query)
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const addProduct = async (req: any, res: any, next: any) => {
  const product = req.body;
  product['sales_person_id'] = req.user?.id

  _addProduct(product)
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const removeProduct = async (req: any, res: any, next: any) => {
  const id = req.params.id;

  _removeProduct(id)
    .then(() => res.status(200).json({ message: "Product removed" }))
    .catch(next);
};

const updateProduct = async (req: any, res: any, next: any) => {
  const id = req.params.id;
  const updates = req.body;

  _updateProduct(id, updates)
    .then((data) => res.status(200).json(data))
    .catch(next);
};

export default {
  fetchProducts,
  fetchAdminProducts,
  fetchProductById,
  addProduct,
  removeProduct,
  updateProduct,
  searchProductByName,
  fetchFilterParams,
  fetchCategories
};
