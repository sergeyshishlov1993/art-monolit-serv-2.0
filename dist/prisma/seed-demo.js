const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const PRODUCTS = [
    ['Пам\'ятник Класика Чорний', 'pamyatnik-klasika-chornyj', 'pamyatniki', ['granit'], ['odinochnyie'], ['HIT'], null],
    ['Пам\'ятник Арка', 'pamyatnik-arka', 'pamyatniki', ['granit'], ['odinochnyie'], ['NEW'], null],
    ['Пам\'ятник Серце', 'pamyatnik-sertse', 'pamyatniki', ['mramor'], ['odinochnyie'], [], 10],
    ['Пам\'ятник Хрест', 'pamyatnik-hrest', 'pamyatniki', ['granit'], ['odinochnyie'], ['HIT'], null],
    ['Подвійний пам\'ятник Гармонія', 'podvijnyj-harmoniya', 'dvojnye', ['granit'], ['semejnyie'], ['NEW'], null],
    ['Подвійний пам\'ятник Єдність', 'podvijnyj-yednist', 'dvojnye', ['mramor'], ['semejnyie'], ['SALE'], 15],
    ['Військовий пам\'ятник Герой', 'vijskovyj-heroj', 'voenye', ['granit'], ['odinochnyie'], ['HIT'], null],
    ['Військовий пам\'ятник Захисник', 'vijskovyj-zahysnyk', 'voenye', ['granit'], ['odinochnyie'], [], null],
    ['Ваза гранітна', 'vaza-hranitna', 'aksesuary', ['granit'], [], [], null],
    ['Лампада мармурова', 'lampada-mramorna', 'aksesuary', ['mramor'], [], ['SALE'], 20],
    ['Комплекс Родинний', 'kompleks-rodynnyj', 'kompleksy', ['granit'], ['semejnyie'], ['NEW'], null],
    ['Комплекс Класичний', 'kompleks-klasychnyj', 'kompleksy', ['granit', 'mramor'], ['semejnyie'], [], 5],
];
const EXTRA_CATEGORIES = [
    ['pamyatniki', 'Пам\'ятник'], ['dvojnye', 'Подвійний пам\'ятник'], ['voenye', 'Військовий пам\'ятник'],
    ['aksesuary', 'Аксесуар'], ['kompleksy', 'Комплекс'], ['ogrady', 'Огорожа'],
];
const EXTRA_NAMES = ['Лотос', 'Обеліск', 'Ліра', 'Вікторія', 'Журавлі', 'Дерево життя', 'Ангел', 'Сонце'];
const EXTRA_BADGES = [[], [], ['NEW'], ['HIT'], [], ['SALE'], [], ['NEW', 'HIT']];
const EXTRA_MATERIALS = [['granit'], ['mramor'], ['granit', 'mramor'], ['granit']];
const EXTRA_GROUPS = [['odinochnyie'], ['semejnyie'], [], ['odinochnyie', 'semejnyie']];
const EXTRA = EXTRA_CATEGORIES.flatMap(([categorySlug, prefix]) => EXTRA_NAMES.map((name, i) => [
    `${prefix} ${name}`,
    `demo-${categorySlug}-${i + 1}`,
    categorySlug,
    EXTRA_MATERIALS[i % EXTRA_MATERIALS.length],
    EXTRA_GROUPS[i % EXTRA_GROUPS.length],
    EXTRA_BADGES[i],
    EXTRA_BADGES[i].includes('SALE') ? 10 + (i % 3) * 5 : null,
]));
const SPECS = [
    ['Матеріал', 'Граніт'],
    ['Розмір стели', '100×50×8 см'],
    ['Вага', '120 кг'],
    ['Термін виготовлення', 'від 25 днів'],
];
async function main() {
    const [categories, materials, groups] = await Promise.all([
        prisma.category.findMany(), prisma.material.findMany(), prisma.targetGroup.findMany(),
    ]);
    const bySlug = (list) => Object.fromEntries(list.map((x) => [x.slug, x.id]));
    const cat = bySlug(categories), mat = bySlug(materials), grp = bySlug(groups);
    let imageIndex = 1;
    for (const [title, slug, categorySlug, materialSlugs, groupSlugs, badges, discount] of [...PRODUCTS, ...EXTRA]) {
        if (!cat[categorySlug])
            continue;
        const product = await prisma.product.upsert({
            where: { slug },
            update: {},
            create: {
                title, slug,
                description: `${title} — демонстраційний виріб з натурального каменю. Виготовляємо на власному виробництві.`,
                categoryId: cat[categorySlug],
                badges: [...badges],
                discountPercent: discount,
                materials: { connect: materialSlugs.filter((s) => mat[s]).map((s) => ({ id: mat[s] })) },
                targetGroups: { connect: groupSlugs.filter((s) => grp[s]).map((s) => ({ id: grp[s] })) },
                specs: { create: SPECS.map(([key, value], sortOrder) => ({ key, value, sortOrder })) },
            },
        });
        const hasImage = await prisma.productImage.count({ where: { productId: product.id } });
        if (!hasImage) {
            const n = ((imageIndex - 1) % 15) + 1;
            await prisma.productImage.create({
                data: { productId: product.id, s3Key: `demo/product-${n}`, url: `/demo/product-${n}.svg`, isMain: true, alt: title },
            });
            if (imageIndex % 3 === 0) {
                for (const extra of [1, 2]) {
                    const m = ((n + extra * 4 - 1) % 15) + 1;
                    await prisma.productImage.create({
                        data: { productId: product.id, s3Key: `demo/product-${m}`, url: `/demo/product-${m}.svg`, sortOrder: extra, isMain: false, alt: `${title} — фото ${extra + 1}` },
                    });
                }
            }
        }
        imageIndex++;
    }
    for (const product of await prisma.product.findMany({ where: { images: { none: {} } } })) {
        await prisma.productImage.create({
            data: { productId: product.id, s3Key: 'demo/product-13', url: '/demo/product-13.svg', isMain: true, alt: product.title },
        });
    }
    if ((await prisma.heroSlide.count()) === 0) {
        await prisma.heroSlide.createMany({
            data: [
                { title: 'Пам\'ятники з граніту та мармуру', subtitle: 'Власне виробництво. Гарантія 25 років.', buttonText: 'Дивитись каталог', buttonLink: '/catalog', imageUrl: '/demo/hero-1.svg', focusDesktop: '50% 40%', focusTablet: '50% 50%', focusMobile: '50% 50%', sortOrder: 0 },
                { title: 'Індивідуальні проєкти', subtitle: 'Від ескізу до установки', buttonText: 'Наші роботи', buttonLink: '/portfolio', imageUrl: '/demo/hero-2.svg', focusDesktop: '30% 50%', focusTablet: '40% 50%', focusMobile: '35% 50%', sortOrder: 1 },
                { title: 'Безкоштовна доставка', subtitle: 'По всій Україні', buttonText: 'Детальніше', buttonLink: '/delivery', imageUrl: '/demo/hero-3.svg', sortOrder: 2 },
            ],
        });
    }
    const worksToAdd = Math.max(0, 24 - (await prisma.portfolioWork.count()));
    if (worksToAdd > 0) {
        const categoryIds = Object.values(cat);
        for (let i = 1; i <= worksToAdd; i++) {
            const w = ((i - 1) % 6) + 1;
            await prisma.portfolioWork.create({
                data: {
                    categoryId: categoryIds[i % categoryIds.length],
                    sortOrder: 10 + i,
                    materials: { connect: [{ id: mat[i % 2 ? 'granit' : 'mramor'] }] },
                    targetGroups: { connect: [{ id: grp[i % 2 ? 'odinochnyie' : 'semejnyie'] }] },
                    images: { create: [{ s3Key: `demo/work-${w}`, url: `/demo/work-${w}.svg`, alt: `Демо робота ${i}` }] },
                },
            });
        }
    }
    const leadsToAdd = Math.max(0, 40 - (await prisma.lead.count()));
    if (leadsToAdd > 0) {
        const names = ['Олена Коваль', 'Андрій Мельник', 'Ірина Шевченко', 'Василь Бондар', 'Наталія Ткачук', 'Сергій Кравець', 'Оксана Мороз', 'Петро Лисенко', 'Марина Гончар', 'Дмитро Савченко', 'Тетяна Павленко', 'Юрій Руденко'];
        const statuses = ['NEW', 'NEW', 'IN_PROGRESS', 'DONE', 'CANCELED', 'NEW', 'IN_PROGRESS', 'DONE', 'NEW', 'DONE'];
        const sources = ['product_page', 'contact_page', 'product_page', 'contact_page', 'phone', 'telegram', 'viber', 'instagram'];
        const messages = [null, 'Підкажіть вартість і терміни', 'Потрібен розрахунок <2 пам\'ятники> & доставка', 'Хочу такий самий, як на фото. Додам портрет.', 'Телефонуйте після 18:00'];
        const products = await prisma.product.findMany({ take: 30 });
        await prisma.lead.createMany({
            data: Array.from({ length: leadsToAdd }, (_, i) => ({
                name: names[i % names.length],
                phone: `+38050${String(1000000 + i * 137).slice(0, 7)}`,
                message: messages[i % messages.length],
                status: statuses[i % statuses.length],
                source: sources[i % sources.length],
                productId: i % 4 === 3 ? null : products[i % products.length]?.id ?? null,
                createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 17),
            })),
        });
    }
    console.log('Demo seed completed');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-demo.js.map