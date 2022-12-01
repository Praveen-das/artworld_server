import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

interface sortInterface {
  item: any;
  method: string;
}

const select = {
  name: true,
  desc: true,
  material: true,
  category: true,
  width: true,
  height: true,
  quantity: true,
  price: true,
  discount: true,
  images: true,
  reviews: true,
  createdAt: true,
  sales_person: true,
  defaultImage: true,
  id: true,
};

const _fetchProducts = async (
  
  sort: sortInterface,
  { price_range = {}, ...product }: any, ////destructure price range from facets and assign rest to product
  search: any,
  page: number,
  limit: number
  ) => {

  let { lt, gt } = price_range; /////////////parse price range to integer
  price_range.lt = lt && parseInt(lt) + 1; //parse price range to integer
  price_range.gt = gt && parseInt(gt) - 1; //parse price range to integer

  const data = await db.$transaction([
    db.product.findMany({
      where: {
        ...product,
        ...search,
        price: { ...price_range },
      },
      select,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort.item]: sort.method },
    }),
    db.product.count({
      select: { id: true },
      where: { ...product, ...search, price: { ...price_range } },
    }),
  ]);

  return data
}

const _fetchAdminProducts = async (
  userId: string,
  search: any,
  page: number,
  limit: number
) => {
  const data: object = await db.$transaction([
    db.product.findMany({
      where: {
        sales_person_id: userId,
        ...search
      },
      select,
      skip: (page - 1) * limit,
      take: limit
    }),
    db.product.count({
      select: { id: true },
      where: {
        sales_person_id: userId, ...search
      },
    }),
  ]);

  return data;
};

const _fetchProductById = async (id: string) => {
  const res = await db.product.findUnique({
    where: { id },
    select,
  });
  return res;
};

const _addProduct = async (product: any) => {
  const res = await db.product.create({
    data: product,
    select,
  });

  return res;
};

const _removeProduct = async (id: string) => {
  const res = await db.product.delete({ where: { id } });
  return res;
};

const _updateProduct = async (id: string, updates: any) => {
  const res = await db.product.update({
    where: { id },
    data: updates,
    // select,
  });
  return res;
};

const _searchProduct = async (query: any) => {
  const data = await db.product.findMany({
    orderBy: query.sort.item === "price" ? { price: "asc" } : { price: "desc" },
    where: {
      name: query.name,
    },
    select,
    take: 20,
  });
  return data;
};

export {
  _fetchProducts,
  _fetchAdminProducts,
  _fetchProductById,
  _addProduct,
  _removeProduct,
  _updateProduct,
  _searchProduct,
};
