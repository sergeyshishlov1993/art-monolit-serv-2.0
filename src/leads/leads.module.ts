import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { AuthModule } from '../auth/auth.module';
import { SiteSettingsModule } from '../site-settings/site-settings.module';
import { LeadReminderService } from './lead-reminder.service';

@Module({
    imports: [AuthModule, SiteSettingsModule],
    controllers: [LeadsController],
    providers: [LeadsService, LeadReminderService],
})
export class LeadsModule {}