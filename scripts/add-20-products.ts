import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const userId = "118373901310816826366";

const paintingsData = [
  {
    name: "Sunset Whispers",
    desc: "An emotional sunset landscape capturing golden light rays filtering through storm clouds over a calm ocean.",
  },
  {
    name: "Ethereal Dreams",
    desc: "A surreal, dreamlike canvas filled with floating geometric shapes and soft pastel gradients.",
  },
  {
    name: "Urban Solitude",
    desc: "A gritty yet peaceful street scene featuring a single illuminated window in a dark city block.",
  },
  {
    name: "Forest Path",
    desc: "An impressionist piece detailing a sun-dappled trail winding deep through an ancient green forest.",
  },
  {
    name: "Crimson Symphony",
    desc: "A dynamic abstract expressionist work dominated by deep reds, oranges, and dramatic black brushstrokes.",
  },
  {
    name: "Oceanic Serenade",
    desc: "A high-textured palette knife painting showing crashing turquoise waves against dark volcanic rocks.",
  },
  {
    name: "Misty Valleys",
    desc: "A peaceful watercolor showing layers of distant blue mountains fading into thick morning mist.",
  },
  {
    name: "Still Life with Peonies",
    desc: "A classical still life composition featuring fresh pink peonies in a rustic glass vase.",
  },
  {
    name: "Cosmic Dance",
    desc: "A vibrant digital-style painting of swirling nebulas, stars, and deep cosmic elements.",
  },
  {
    name: "Golden Harmony",
    desc: "A minimal, textured art piece with real gold leaf details laid over warm neutral beige tones.",
  },
  {
    name: "Autumn Resonance",
    desc: "A warm and inviting abstract representing the changing colors of leaves in the fall.",
  },
  {
    name: "Spring Awakening",
    desc: "A colorful field of wildflowers painted in a bright, energetic impressionist style.",
  },
  {
    name: "Shadows of Midnight",
    desc: "A moody, low-light nightscape depicting streetlights reflecting off wet asphalt after rain.",
  },
  {
    name: "Silent Reflection",
    desc: "A peaceful lake painting showcasing a perfect mirror reflection of the trees and sky.",
  },
  {
    name: "Abstract Illusions",
    desc: "A geometric abstract composition using intersecting lines and bold, contrasting color blocks.",
  },
  {
    name: "Whispers of the Wind",
    desc: "A delicate ink and wash drawing showing tall grasses bending under a strong breeze.",
  },
  {
    name: "Summer Haze",
    desc: "A beach scene painted with warm, sunny colors, showing distant sailboats on the horizon.",
  },
  {
    name: "The Red Umbrella",
    desc: "A black and white street scene with a single pop of crimson from a pedestrian's umbrella.",
  },
  {
    name: "Enchanted Garden",
    desc: "A lush, fantasy-themed garden overflowing with colorful, oversized flora and glowing lights.",
  },
  {
    name: "Rustic Charm",
    desc: "A textured painting of an old, weathered barn door surrounded by ivy and wildflowers.",
  },
];

async function main() {
  try {
    console.log("Connecting to the database...");

    // 1. Ensure user exists and is a seller
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { linked_account: true },
    });

    if (!user) {
      console.log(`User ${userId} does not exist. Creating seller profile...`);
      user = await prisma.user.create({
        data: {
          id: userId,
          displayName: "Art Gallery Seller",
          email: "gallery.seller@example.com",
          role: "seller",
          onboardingStatus: "success",
          linked_account: {
            create: {
              accountId: "acc_" + randomUUID().replace(/-/g, "").substring(0, 14),
            },
          },
        },
        include: { linked_account: true },
      });
    } else {
      console.log(`User ${userId} found. Ensuring role is seller and onboardingStatus is success...`);
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          role: "seller",
          onboardingStatus: "success",
          ...(user.linked_account ? {} : {
            linked_account: {
              create: {
                accountId: "acc_" + randomUUID().replace(/-/g, "").substring(0, 14),
              },
            },
          }),
        },
        include: { linked_account: true },
      });
    }

    console.log(`Seller configured: ${user.displayName} (ID: ${user.id})`);

    // 2. Fetch or create category/subject/style/material/collection references
    console.log("Fetching reference records...");
    let categories = await prisma.category.findMany();
    let subjects = await prisma.subject.findMany();
    let styles = await prisma.style.findMany();
    let materials = await prisma.material.findMany();
    let collections = await prisma.collections.findMany();

    if (categories.length === 0) {
      console.log("No categories found. Seeding default Category...");
      categories = [await prisma.category.create({ data: { name: "Oil Painting" } })];
    }
    if (subjects.length === 0) {
      console.log("No subjects found. Seeding default Subject...");
      subjects = [await prisma.subject.create({ data: { name: "Contemporary" } })];
    }
    if (styles.length === 0) {
      console.log("No styles found. Seeding default Style...");
      styles = [await prisma.style.create({ data: { name: "Abstract" } })];
    }
    if (materials.length === 0) {
      console.log("No materials found. Seeding default Material...");
      materials = [await prisma.material.create({ data: { name: "Canvas" } })];
    }
    if (collections.length === 0) {
      console.log("No collections found. Seeding default Collection...");
      collections = [await prisma.collections.create({ data: { name: "Paintings" } })];
    }

    // 3. Load sample images from images.json
    console.log("Loading sample images from images.json...");
    const imagesPath = path.join(__dirname, "images.json");
    let availableImages: any[] = [];
    if (fs.existsSync(imagesPath)) {
      try {
        const fileContent = fs.readFileSync(imagesPath, "utf-8");
        const parsedImages = JSON.parse(fileContent);
        if (Array.isArray(parsedImages)) {
          availableImages = parsedImages.filter((img: any) => img.url);
        }
      } catch (err) {
        console.error("Failed to parse images.json:", err);
      }
    }

    if (availableImages.length === 0) {
      console.log("No images available from images.json. Using placeholders.");
      availableImages = [
        {
          url: "https://picsum.photos/id/10/600/800.jpg",
          fileId: "placeholder-10",
          name: "placeholder-10.jpg",
        },
        {
          url: "https://picsum.photos/id/11/600/800.jpg",
          fileId: "placeholder-11",
          name: "placeholder-11.jpg",
        },
        {
          url: "https://picsum.photos/id/12/600/800.jpg",
          fileId: "placeholder-12",
          name: "placeholder-12.jpg",
        },
      ];
    }

    console.log(`Loaded ${availableImages.length} available images. Preparing 20 products...`);

    // Helper to pick a random element
    const randomChoice = <T>(arr: T[]): T => {
      const idx = Math.floor(Math.random() * arr.length);
      const res = arr[idx];
      if (res === undefined) {
        throw new Error("Empty array selection");
      }
      return res;
    };

    // Helper to get random subset of images
    const getRandomImages = (count: number) => {
      const selected: any[] = [];
      for (let i = 0; i < count; i++) {
        const img = randomChoice(availableImages);
        selected.push({
          url: img.url,
          fileId: img.fileId || randomUUID(),
          name: img.name || `image-${i}.jpg`,
        });
      }
      return selected;
    };

    // 4. Create products
    const productsCreated = [];
    for (let i = 0; i < paintingsData.length; i++) {
      const paint = paintingsData[i]!;
      const category = randomChoice(categories);
      const subject = randomChoice(subjects);
      const style = randomChoice(styles);
      const material = randomChoice(materials);
      const collection = randomChoice(collections);

      // Random price, discount, dimensions
      const price = 5000 + Math.floor(Math.random() * 95) * 1000; // 5000 to 99000
      const discount = randomChoice([0, 5, 10, 15, 20]);
      const width = 12 + Math.floor(Math.random() * 37); // 12 to 48
      const height = 12 + Math.floor(Math.random() * 37); // 12 to 48
      const sellingOption = randomChoice(["ORIGINAL", "PRINT"]) as "ORIGINAL" | "PRINT";
      const rating = randomChoice([3, 4, 5]);
      const quantity = sellingOption === "ORIGINAL" ? 1 : 2 + Math.floor(Math.random() * 8); // 1 for original, 2-9 for prints

      const numImages = randomChoice([1, 2, 3]);
      const images = getRandomImages(numImages);

      console.log(`Creating product: "${paint.name}" (${sellingOption})`);

      const product = await prisma.product.create({
        data: {
          name: paint.name,
          desc: paint.desc,
          price: price,
          discount: discount,
          images: images,
          widthInInches: width,
          heightInInches: height,
          sellingOption: sellingOption,
          rating: rating,
          category_id: category.id,
          subject_id: subject.id,
          style_id: style.id,
          material_id: material.id,
          collections_id: collection.id,
          sales_person_id: userId,
          inventory: {
            create: {
              availableQty: quantity,
            },
          },
        },
        include: { inventory: true },
      });

      productsCreated.push(product);
    }

    console.log(`Successfully added ${productsCreated.length} products to the database!`);
  } catch (error) {
    console.error("An error occurred during product insertion:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
