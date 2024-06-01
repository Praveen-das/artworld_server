import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

interface sortInterface {
  item: any;
  method: string;
}

interface Product_Item {
  product: {
    name: string;
    description: string;
    material_id: number;
    category_id: number;
  };
  item: {
    price: number;
    size: number;
    quantity: number;
    images: string[];
    tags: string[];
  };
  price_range: any;
}

const _fetchProducts = async (
  sort: sortInterface,
  { price_range = {}, ...product }: Product_Item, ////destructure price range from facets and assign rest to product
  page: number,
  limit: number
) => {
  let { lt, gt } = price_range; /////////////parse price range to integer
  price_range.lt = lt && parseInt(lt) + 1; //parse price range to integer
  price_range.gt = gt && parseInt(gt) - 1; //parse price range to integer

  const data = await db.product.findMany({
    where: {
      ...product,
      item: {
        price: { ...price_range },
      },
    },
    include: { item: true, material: true, category: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sort.item]: sort.method },
  });
  return data;
};

const _fetchProductById = async (id: string) => {
  const res = await db.product.findUnique({
    where: { id },
    include: {
      item: true,
    },
  });
  return res;
};

const _addProduct = async ({ product, item }: Product_Item) => {
  const res = await db.product.create({
    data: {
      ...product,
      item: {
        create: item,
      },
    },
    include: {
      item: true,
      material: true,
      category: true,
    },
  });
  return res;
};

const _removeProduct = async (id: string) => {
  const res = await db.product.delete({ where: { id } });
  return res;
};

const _updateProduct = async (id: string, { product, item }: Product_Item) => {
  const res = await db.product.update({
    where: { id },
    data: {
      ...product,
      item: {
        update: item,
      },
    },
    include: {
      item: true,
    },
  });
  return res;
};

const _searchProduct = async (query: any) => {
  const data = await db.item.findMany({
    orderBy: query.sort.item === "price" ? { price: "asc" } : { price: "desc" },
    where: {
      product: {
        name: query.name,
      },
    },
    include: {
      product: true,
    },
    take: 20,
  });
  return data;
};

export {
  _fetchProducts,
  _fetchProductById,
  _addProduct,
  _removeProduct,
  _updateProduct,
  _searchProduct,
};
