const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  await prisma.category.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.style.deleteMany();
  await prisma.material.deleteMany();
  await prisma.collections.deleteMany();

  await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Subject_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Style_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Material_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Collections_id_seq" RESTART WITH 1;`;

  const category = await prisma.category.createMany({
    data: [
      { name: "Oil Painting" },
      { name: "Acrylic Painting" },
      { name: "Watercolor" },
      { name: "Gouache Painting" },
      { name: "Pastel Artworks" },
      { name: "Digital Painting" },
      { name: "Spray Paint Art" },
      { name: "Pencil Drawing" },
      { name: "Ink Drawing" },
      { name: "Charcoal Drawing" },
      { name: "Colored Pencil Art" },
      { name: "Pastel Drawing" },
      { name: "Pen and Ink Art" },
      { name: "Graphite Drawing" },
      { name: "Conté Crayon Drawing" },
    ],
  });

  const subject = await prisma.subject.createMany({
    data: [
      { name: "Still Life" },
      { name: "Anatomy" },
      { name: "Beach" },
      { name: "Boats" },
      { name: "Celebrities" },
      { name: "Characters" },
      { name: "Children" },
      { name: "Cities" },
      { name: "Contemporary" },
      { name: "Cosmos" },
      { name: "Countryside" },
      { name: "Culture" },
      { name: "Dogs" },
      { name: "Dance" },
      { name: "Dolls" },
      { name: "Dream" },
      { name: "Ecology" },
      { name: "Emotions" },
      { name: "Eroticism" },
      { name: "Ethnic" },
      { name: "Fairies" },
      { name: "Family" },
      { name: "Fish" },
      { name: "Forest" },
      { name: "Furniture" },
      { name: "Horses" },
      { name: "Imagination" },
      { name: "Industry" },
      { name: "Journey" },
      { name: "Love" },
      { name: "Men" },
      { name: "Monument" },
      { name: "Mountain" },
      { name: "Nightscape" },
      { name: "Masks" },
      { name: "Marine" },
      { name: "Plant" },
      { name: "Politics" },
      { name: "Pottery" },
      { name: "Railway" },
      { name: "Reflection" },
      { name: "Scene of Life" },
      { name: "Scene of Street" },
      { name: "Science Fiction" },
      { name: "Self Portrait" },
      { name: "Sea" },
      { name: "Seasons" },
      { name: "Sensual" },
      { name: "Simply Color" },
      { name: "Spiritual" },
      { name: "Sport" },
      { name: "Surrealism" },
      { name: "Vase" },
      { name: "Vegetables" },
      { name: "War" },
      { name: "Wildlife" },
      { name: "Winter" },
      { name: "Fruits" },
      { name: "Seascape" },
      { name: "Botanical" },
      { name: "Village" },
      { name: "Music" },
      { name: "Buildings" },
      { name: "Figurative" },
      { name: "Objects" },
      { name: "Birds" },
      { name: "People" },
    ],
  });

  const material = await prisma.material.createMany({
    data: [
      { name: "Canvas" },
      { name: "Paper" },
      { name: "Wood" },
      { name: "Watercolor Paper" },
      { name: "Illustration Board" },
      { name: "Linen" },
      { name: "Cardboard" },
      { name: "Metal" },
      { name: "Fabric" },
      { name: "Silk" },
      { name: "Cotton" },
      { name: "Chiffon" },
      { name: "Georgette" },
      { name: "Velvet" },
      { name: "Satin" },
      { name: "Organza" },
      { name: "Brocade" },
      { name: "Chanderi" },
      { name: "Banarasi" },
      { name: "Khadi" },
      { name: "Tussar" },
      { name: "Crepe" },
      { name: "Net" },
      { name: "Muslin" },
      { name: "Jute" },
      { name: "Kanjivaram" },
      { name: "Pashmina" },
      { name: "Embroidered Fabrics" },
    ],
  });

  const styles = await prisma.style.createMany({
    data: [
      { name: "Impressionism" },
      { name: "Fantasy" },
      { name: "Expressionism" },
      { name: "Conceptual" },
      { name: "Cubism" },
      { name: "Abstract" },
      { name: "Photorealism" },
      { name: "Minimalism" },
      { name: "Folk" },
      { name: "Line Art" },
    ],
  });

  const collections = await prisma.collections.createMany({
    data: [
      { name: "Ethnic Dress Artistry" },
      { name: "Artful Home Decor" },
      { name: "Mural Magic" },
      { name: "Line Art Creations" },
      { name: "Nature's Beauty" },
      { name: "Cultural Elegance" },
      { name: "Expressions of Love" },
      { name: "Paintings" },
      { name: "Drawings" },
    ],
  });

  // const res = await prisma.product.create({
  //   data: {
  //     name: "Artwork 2a7dbc",
  //     desc: "A beautiful piece of art showcasing intricate work.",
  //     price: 97808,
  //     discount: 15,
  //     images: [
  //       {
  //         url: "http://picsum.photos/id/13/600/800.jpg",
  //       },
  //       {
  //         url: "http://picsum.photos/id/14/600/800.jpg",
  //       },
  //     ],
  //     widthInInches: 27,
  //     heightInInches: 50,
  //     sellingOption: "PRINT",
  //     rating: 4,
  //     id: "1a8a8abf-65cd-4455-8d01-f73c4864dcd4",
  //     category_id: 2,
  //     subject_id: 24,
  //     style_id: 6,
  //     material_id: 10,
  //     collections_id: 1,
  //     sales_person_id: "c1951437-5c67-4402-ab7b-0f65f9f17648",
  //     inventory: {
  //       create: {
  //         availableQty: 5,
  //       },
  //     },
  //   },
  //   include: { inventory: true },
  // });
}

// const asd = async () => {
//   const inventory = await prisma.$transaction([
//     prisma.product.create({
//       name: "Artwork a355120",
//       desc: "A beautiful piece of art showcasing intricate work.",
//       price: 26783,
//       discount: 0,
//       images: [
//         {
//           url: "http://picsum.photos/id/10/600/800.jpg",
//         },
//         {
//           url: "http://picsum.photos/id/11/600/800.jpg",
//         },
//         {
//           url: "http://picsum.photos/id/12/600/800.jpg",
//         },
//       ],
//       widthInInches: 36,
//       heightInInches: 37,
//       sellingOption: "PRINT",
//       rating: 2,
//       id: "1165835a-4414-47a6-bcd8-d548830e1f06",
//       category_id: 2,
//       subject_id: 5,
//       style_id: 10,
//       material_id: 19,
//       collections_id: 9,
//       sales_person_id: "c1951437-5c67-4402-ab7b-0f65f9f17648",
//       inventory: {
//         create: {
//           availableQty: 5,
//         },
//       },
//     }),
//   ]);

//   console.log(inventory);
// };

// asd();

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
