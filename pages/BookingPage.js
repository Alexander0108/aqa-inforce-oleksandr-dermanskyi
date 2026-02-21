import { expect } from '@playwright/test';

export class BookingPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://automationintesting.online/';
        
        // Кнопка на головному екрані
        this.heroBtn = page.locator('button').filter({ hasText: /^Book Now$/i });
        
        // Поля введення дат (наша робоча логіка)
        this.checkInInput = page.locator('input[type="text"]').first();
        this.checkOutInput = page.locator('input[type="text"]').nth(1);
        this.checkAvailabilityBtn = page.getByRole('button', { name: 'Check Availability' });
    }

    async navigate() {
        await this.page.goto(this.url, { waitUntil: 'networkidle' });
    }

    async startBookingProcess(checkIn, checkOut) {
        // Клік по головній кнопці для скролу
        if (await this.heroBtn.isVisible()) {
            await this.heroBtn.click();
        }

        await this.checkAvailabilityBtn.waitFor({ state: 'attached', timeout: 10000 });
        await this.checkAvailabilityBtn.scrollIntoViewIfNeeded();

        // Заповнення дат
        await this.checkInInput.fill(checkIn);
        await this.checkOutInput.fill(checkOut);
        await this.checkAvailabilityBtn.click();
    }

    async clickFirstRoom() {
        // ВИПРАВЛЕННЯ: Шукаємо кнопку 'Book now' ТІЛЬКИ всередині блоку #rooms
        // Це не дасть йому повернутися на початок сайту
        const roomBtn = this.page.locator('#rooms').getByRole('link', { name: /Book now/i }).first();
        
        await roomBtn.waitFor({ state: 'visible', timeout: 10000 });
        await roomBtn.scrollIntoViewIfNeeded();
        await roomBtn.click();
    }
}