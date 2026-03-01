const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            email: 'admin@admin.com',
            passwordHash: adminPassword,
            role: 'ADMIN',
            isActive: true,
        },
    });
    console.log('Admin created:', admin.email);
    const category1 = await prisma.category.upsert({
        where: { slug: 'pamyatniki' },
        update: {},
        create: {
            name: 'Памятники',
            slug: 'pamyatniki',
            description: 'Гранитные и мраморные памятники',
            sortOrder: 1,
        },
    });
    const category2 = await prisma.category.upsert({
        where: { slug: 'ogrady' },
        update: {},
        create: {
            name: 'Ограды',
            slug: 'ogrady',
            description: 'Ограды для захоронений',
            sortOrder: 2,
        },
    });
    const category3 = await prisma.category.upsert({
        where: { slug: 'komplekty' },
        update: {},
        create: {
            name: 'Комплекты',
            slug: 'komplekty',
            description: 'Готовые мемориальные комплекты',
            sortOrder: 3,
        },
    });
    const material1 = await prisma.material.upsert({
        where: { slug: 'granit' },
        update: {},
        create: {
            name: 'Гранит',
            slug: 'granit',
            sortOrder: 1,
        },
    });
    const material2 = await prisma.material.upsert({
        where: { slug: 'mramor' },
        update: {},
        create: {
            name: 'Мрамор',
            slug: 'mramor',
            sortOrder: 2,
        },
    });
    const targetGroup1 = await prisma.targetGroup.upsert({
        where: { slug: 'odinochnyie' },
        update: {},
        create: {
            name: 'Одиночные',
            slug: 'odinochnyie',
            sortOrder: 1,
        },
    });
    const targetGroup2 = await prisma.targetGroup.upsert({
        where: { slug: 'semejnyie' },
        update: {},
        create: {
            name: 'Семейные',
            slug: 'semejnyie',
            sortOrder: 2,
        },
    });
    const product1 = await prisma.product.upsert({
        where: { slug: 'pamyatnik-granit-klassika' },
        update: {},
        create: {
            title: 'Памятник Гранит Классика',
            slug: 'pamyatnik-granit-klassika',
            description: 'Классический памятник из чёрного гранита',
            categoryId: category1.id,
            seoTitle: 'Памятник из гранита — классическая форма',
            seoDescription: 'Купить классический гранитный памятник',
        },
    });
    const product2 = await prisma.product.upsert({
        where: { slug: 'pamyatnik-mramor-oval' },
        update: {},
        create: {
            title: 'Памятник Мрамор Овал',
            slug: 'pamyatnik-mramor-oval',
            description: 'Овальный памятник из белого мрамора',
            categoryId: category1.id,
        },
    });
    const product3 = await prisma.product.upsert({
        where: { slug: 'ograda-kovannaya-standart' },
        update: {},
        create: {
            title: 'Ограда кованая Стандарт',
            slug: 'ograda-kovannaya-standart',
            description: 'Стандартная кованая ограда',
            categoryId: category2.id,
        },
    });
    await prisma.portfolioWork.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            categoryId: category3.id,
            sortOrder: 1,
            targetGroups: { connect: [{ id: targetGroup2.id }] },
            materials: { connect: [{ id: material1.id }, { id: material2.id }] },
        },
    });
    await prisma.portfolioWork.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            categoryId: category1.id,
            sortOrder: 2,
            targetGroups: { connect: [{ id: targetGroup1.id }] },
            materials: { connect: [{ id: material1.id }] },
        },
    });
    await prisma.lead.createMany({
        skipDuplicates: true,
        data: [
            {
                name: 'Иван Петров',
                phone: '+79001234567',
                message: 'Интересует памятник из гранита',
                productId: product1.id,
                status: 'NEW',
                source: 'site',
            },
            {
                name: 'Мария Сидорова',
                phone: '+79007654321',
                message: 'Нужна ограда, перезвоните',
                status: 'IN_PROGRESS',
                source: 'site',
                adminComment: 'Перезвонить завтра',
            },
        ],
    });
    console.log('Seed completed');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map