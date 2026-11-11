import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

@Controller('site-settings')
export class SiteSettingsController {
    constructor(private readonly siteSettingsService: SiteSettingsService) {}

    @Get()
    get() {
        return this.siteSettingsService.get();
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    update(@Body() dto: UpdateSiteSettingsDto) {
        return this.siteSettingsService.update(dto);
    }
}
