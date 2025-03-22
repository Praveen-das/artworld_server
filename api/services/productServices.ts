import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const include = {
  material: true,
  category: true,
  sales_person: {
    select: {
      createdAt: true,
      displayName: true,
      email: true,
      id: true,
      photo: true,
    }
  },
  reviews: true
};

const _fetchProducts = async (query: any) => {
  let {
    q,
    p,
    limit,
    material,
    category,
    rating,
    discount,
    price_range,
    orderBy
  }: any = query

  let minRating = rating && Math.min(...rating)
  let minDiscount = discount && Math.min(...discount)

  let where = {
    category: { name: category },
    material: { name: { in: material } },
    rating: { gte: minRating },
    discount: { gte: minDiscount },
    price: {
      gte: price_range?.min || undefined,
      lte: price_range?.max || undefined,
    },
    // sales_person_id: facets?.seller_id,
    name: { search: q },
    id: { search: q },
  }

  const data = await db.product.findMany({
    where,
    include,
    skip: (p - 1) * limit,
    take: limit,
    orderBy,
  });

  return data
}

const _fetchFilterParams = async (query: any) => {
  let {
    q,
    material,
    category,
    rating,
    price_range,
  }: any = query

  let minRating = rating && Math.min(...rating)

  let where = {
    category: { name: category },
    price: {
      gte: price_range?.min || undefined,
      lte: price_range?.max || undefined,
    },
    // sales_person_id: facets?.seller_id,
    name: { search: q },
    id: { search: q },
  }

  let wedgetItems = {
    material: { name: { in: material } },
    rating: { gte: minRating },
  }

  const data = await db.$transaction<any>([
    db.product.count({
      select: { id: true },
      where: { ...where, ...wedgetItems },
    }),
    db.product.aggregate({
      _min: { price: true },
      _max: { price: true },
      where: { ...where, ...wedgetItems },
    }),
    db.product.findMany({
      distinct: ['category_id'],
      select: { category: { select: { name: true } } },
      orderBy: { category: { name: 'asc' } }
    }),
    db.product.findMany({
      where,
      distinct: ['material_id'],
      select: { material: { select: { name: true } } },
      orderBy: { material: { name: 'asc' } }
    }),
    db.product.findMany({
      where,
      distinct: ['rating'],
      select: { rating: true },
      orderBy: { rating: 'asc' }
    }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
    db.material.findMany({ orderBy: { name: 'asc' } }),
  ]);

  let formatedData = {
    total: Object.values(data[0])[0],
    priceRange: {
      min: data[1]._min.price,
      max: data[1]._max.price,
    },
    categories: data[2].map(({ category }: any) => category.name),
    materials: data[3].map(({ material }: any) => material.name),
    ratings: data[4],
    allCategories: data[5],
    allMaterials: data[6],
  }

  return formatedData
}
const _fetchCategories = async (query: any) => {
  let {
    q,
    material,
    category,
    rating,
    price_range,
  }: any = query

  let minRating = rating && Math.min(...rating)

  let where = {
    category: { name: category },
    price: {
      gte: price_range?.min || undefined,
      lte: price_range?.max || undefined,
    },
    // sales_person_id: facets?.seller_id,
    name: { search: q },
    id: { search: q },
  }

  let wedgetItems = {
    material: { name: { in: material } },
    rating: { gte: minRating },
  }

  const data = await db.$transaction<any>([
    db.product.findMany({
      distinct: ['category_id'],
      select: { category: { select: { name: true } } },
      orderBy: { category: { name: 'asc' } }
    }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  let formatedData = {
    categories: data[0].map(({ category }: any) => category.name),
    allCategories: data[1],
  }

  return formatedData
}

const _fetchAdminProducts = async (
  userId: string,
  query: any,
) => {
  let { q, p, limit } = query

  const data = await db.product.findMany({
    where: {
      sales_person_id: userId,
      name: { search: q, },
      id: { search: q, }
    },
    include,
    skip: (p - 1) * limit,
    take: limit
  })

  return data;
};

const _fetchProductById = async (id: string) => {
  const res = await db.product.findUnique({
    where: { id },
    include
  });

  return res;
};

const _addProduct = async (product: any) => {
  const res = await db.product.create({
    data: product,
    include
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
    // include
  });
  return res;
};

const _searchProduct = async (query: any) => {
  const data = await db.product.findMany({
    orderBy: query.sort.item === "price" ? { price: "asc" } : { price: "desc" },
    where: {
      name: query.name,
    },
    include,
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
  _fetchFilterParams,
  _fetchCategories
};
