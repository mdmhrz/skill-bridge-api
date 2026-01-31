import { prisma } from "../lib/prisma"


async function main() {
  // Create a new user with a post
  const category = await prisma.category.create({
    data: {
      name: 'Programming',
      slug: 'programming',      
    },    
  })
  console.log('Created category:', category)

  // Fetch all users with their posts
  const allCategories = await prisma.category.findMany()
  console.log('All categories:', JSON.stringify(allCategories, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })