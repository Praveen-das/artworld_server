import {
  _fetchProducts,
  _fetchAdminProducts,
  _addProduct,
  _removeProduct,
  _updateProduct,
  _searchProduct,
  _fetchProductById,
} from "../services/productServices";

const fetchProducts = (req: any, res: any, next: any) => {
  const SORT_DEFAULTS = "createdAt_desc";
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;

  let {
    sort = SORT_DEFAULTS,
    facets = {},
    query,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
  } = req.query;

  let search

  if (query) {
    search = {
      name: {
        search: query
      },
      id: {
        search: query
      },
    }
  }

  const [item, method] = sort?.split("_");
  const sortingConstraints = { item, method };

  limit = parseInt(limit);
  page = parseInt(page);

  _fetchProducts(sortingConstraints, facets, search, page, limit)
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const fetchAdminProducts = (req: any, res: any, next: any) => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const userId = req.user.id

  let {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    query,
  } = req.query;

  let search

  if (query) {
    search = {
      name: {
        search: query
      },
      id: {
        search: query
      },
    }
  }

  limit = parseInt(limit);
  page = parseInt(page);

  _fetchAdminProducts(userId, search, page, limit)
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const fetchProductById = (req: any, res: any, next: any) => {
  const { id } = req.params;

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
  product['sales_person_id'] = req.user.id

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
};
