import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
    prisma.category.deleteMany()
    prisma.material.deleteMany()
    
    const category = await prisma.category.createMany({
        data: [
            { name: "Oil Painting" },
            { name: "Acrylic Painting" },
            { name: "Watercolor" },
            { name: "Mural Painting" },
            { name: "Miniature Painting" },
            { name: "Gouache" },
            { name: "Tempera" },
            { name: "Encaustic" },
            { name: "Fresco" },
            { name: "Ink" },
            { name: "Pastel" },
            { name: "Pencil/Graphite" },
            { name: "Charcoal" },
            { name: "Colored Pencil" },
            { name: "Pen and Ink" },
            { name: "Spray Painting" },
            { name: "Dye" },
            { name: "Casein Painting" },
            { name: "Abstract" },
            { name: "Digital Painting" },
        ],
    });
    const material = await prisma.material.createMany({
        data: [
            { name: "Canvas" },
            { name: "Wood" },
            { name: "Paper" },
            { name: "Cardboard" },
            { name: "Masonite" },
            { name: "Metal" },
            { name: "Glass" },
            { name: "Fabric" },
            { name: "Leather" },
            { name: "Gessoed Board" }
        ],
    });
}
seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
