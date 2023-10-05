import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
    await prisma.category.deleteMany()
    await prisma.subCategory.deleteMany()
    await prisma.subject.deleteMany()
    await prisma.style.deleteMany()
    await prisma.material.deleteMany()
    await prisma.collections.deleteMany()

    const category = await prisma.category.createMany({
        data: [
            { name: "Painting", id: 1001 },
            { name: "Drawing", id: 1002 },
            { name: "Digital Art", id: 1003 },
        ],
    });
    const sub_category = await prisma.subCategory.createMany({
        data: [
            { name: "Oil Painting", category_id: 1001 },
            { name: "Acrylic Painting", category_id: 1001 },
            { name: "Watercolor", category_id: 1001 },
            { name: "Gouache Painting", category_id: 1001 },
            { name: "Pastel Artworks", category_id: 1001 },
            { name: "Digital Painting", category_id: 1001 },
            { name: "Spray Paint Art", category_id: 1001 },
            { name: "Pencil Drawing", category_id: 1002 },
            { name: "Ink Drawing", category_id: 1002 },
            { name: "Charcoal Drawing", category_id: 1002 },
            { name: "Colored Pencil Art", category_id: 1002 },
            { name: "Pastel Drawing", category_id: 1002 },
            { name: "Pen and Ink Art", category_id: 1002 },
            { name: "Graphite Drawing", category_id: 1002 },
            { name: "Conté Crayon Drawing", category_id: 1002 }
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
            { name: "People" }
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
            { name: "Embroidered Fabrics" }
        ]
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
        ]

    })
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
        ]
    })
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
