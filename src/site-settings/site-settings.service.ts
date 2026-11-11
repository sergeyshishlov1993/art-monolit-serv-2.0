import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

export type DayHours = { from: string; to: string } | null;
export type Schedule = { weekdays: DayHours; saturday: DayHours; sunday: DayHours };
export type Store = { id: string; city: string; address: string; mapEmbedUrl: string | null; logo: string | null };

// Значення за замовчуванням збігаються з тим, що раніше було зашито у фронті
export const DEFAULT_SETTINGS = {
    phone1: '+380508520594',
    phone2: '+380985024333',
    email: 'vasilevka.granit@gmail.com',
    messengerPhone: '+380759227258',
    schedule: {
        weekdays: { from: '09:00', to: '18:00' },
        saturday: { from: '10:00', to: '15:00' },
        sunday: null,
    } as Schedule,
    // Магазини, що раніше були зашиті у фронті (constants/contacts.ts)
    stores: [
        {
            id: 'zaporizhzhia',
            city: 'Запоріжжя',
            address: 'м. Запоріжжя, вул. Космічна, 63/1',
            logo: '/cities/zaporizhzhia.png',
            mapEmbedUrl:
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2680.3862949696722!2d35.206000076577126!3d47.793347075062805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dc5e8dd2891185%3A0x8be371d3dda8ebbe!2z0JrQvtGB0LzRltGH0L3QsCDQstGD0LvQuNGG0Y8sIDYzLzEsINCX0LDQv9C-0YDRltC20LbRjywg0JfQsNC_0L7RgNGW0LfRjNC60LAg0L7QsdC70LDRgdGC0YwsIDY5MDAw!5e0!3m2!1suk!2sua!4v1772225755786!5m2!1suk!2sua',
        },
        { id: 'cherkasy', city: 'Черкаси', address: 'м. Черкаси, бул. Шевченко, 335', logo: '/cities/cherkasy.png', mapEmbedUrl: null },
    ] as Store[],
    citySelectorModal: true,
    citySwitcherHeader: true,
};

const toDayHours = (day?: { from: string; to: string } | null): DayHours =>
    day ? { from: day.from, to: day.to } : null;

@Injectable()
export class SiteSettingsService {
    constructor(private readonly prisma: PrismaService) {}

    async get() {
        const row = await this.prisma.siteSettings.findUnique({ where: { id: 1 } });
        if (!row) return DEFAULT_SETTINGS;

        return {
            phone1: row.phone1,
            phone2: row.phone2,
            email: row.email,
            messengerPhone: row.messengerPhone,
            schedule: row.schedule as Schedule,
            // Старі рядки без магазинів отримують значення за замовчуванням
            stores: (row.stores as Store[]).length ? (row.stores as Store[]) : DEFAULT_SETTINGS.stores,
            citySelectorModal: row.citySelectorModal,
            citySwitcherHeader: row.citySwitcherHeader,
        };
    }

    async update(dto: UpdateSiteSettingsDto) {
        if (new Set(dto.stores.map((store) => store.id)).size !== dto.stores.length) {
            throw new BadRequestException('Ідентифікатори магазинів мають бути унікальними');
        }

        const data = {
            phone1: dto.phone1,
            phone2: dto.phone2 || null,
            email: dto.email || null,
            messengerPhone: dto.messengerPhone || null,
            schedule: {
                weekdays: toDayHours(dto.schedule.weekdays),
                saturday: toDayHours(dto.schedule.saturday),
                sunday: toDayHours(dto.schedule.sunday),
            },
            stores: dto.stores.map((store) => ({
                id: store.id,
                city: store.city.trim(),
                address: store.address.trim(),
                mapEmbedUrl: store.mapEmbedUrl || null,
                logo: store.logo || null,
            })),
            citySelectorModal: dto.citySelectorModal,
            citySwitcherHeader: dto.citySwitcherHeader,
        };

        await this.prisma.siteSettings.upsert({
            where: { id: 1 },
            create: { id: 1, ...data },
            update: data,
        });

        return this.get();
    }
}
