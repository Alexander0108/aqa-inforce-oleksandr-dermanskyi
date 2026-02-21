import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage.js';

test.describe('User Room Booking Flow', () => {

    test('TC-01: Should book a room with valid data', async ({ page }) => {
        const bookingPage = new BookingPage(page);
        await bookingPage.navigate();

        // 1. Вводимо дати
        await bookingPage.startBookingProcess('2026-02-21', '2026-02-22');

        // 2. Клікаємо на кнопку біля знайденої кімнати (тепер точно внизу)
        await bookingPage.clickFirstRoom();
        
        // 3. Чекаємо переходу на сторінку /reservation/
        await page.waitForURL(/.*reservation.*/);

        // 4. Твоя робоча логіка заповнення форми
        const reserveBtn = page.getByRole('button', { name: 'Reserve Now' });
        await reserveBtn.click();
        
        await page.getByPlaceholder('Firstname').fill('Oleksandr');
        await page.getByPlaceholder('Lastname').fill('Dermanskyi');
        await page.getByPlaceholder('Email').fill('a.dermanskiy@gmail.com');
        await page.getByPlaceholder('Phone').fill('380664586959');
        
        await reserveBtn.click();

        // 5. Перевірка фінального повідомлення
        await expect(page.getByText('Booking Confirmed')).toBeVisible({ timeout: 10000 });
    });

    test('TC-02: Should show validation errors for invalid data', async ({ page }) => {
        const bookingPage = new BookingPage(page);
        await bookingPage.navigate();

        await bookingPage.startBookingProcess('2026-03-01', '2026-03-02');
        await bookingPage.clickFirstRoom();
        
        await page.waitForURL(/.*reservation.*/);
        const reserveBtn = page.getByRole('button', { name: 'Reserve Now' });
        await reserveBtn.click();

        // 1. Тиснемо кнопку з пустими полями
        await reserveBtn.click(); 
        
        const errorContainer = page.locator('.alert-danger');
        await expect(errorContainer).toBeVisible();
        
        // Використовуємо регулярні вирази, щоб знайти ключові слова в купі тексту
        await expect(errorContainer).toHaveText(/blank|empty/i);

        // 2. Перевірка короткого телефону
        await page.getByPlaceholder('Firstname').fill('Oleksandr');
        await page.getByPlaceholder('Lastname').fill('Dermanskyi');
        await page.getByPlaceholder('Email').fill('test@test.com');
        await page.getByPlaceholder('Phone').fill('12345'); 
        
        await reserveBtn.click();
        
        // Перевіряємо, що з'явилася помилка про розмір (size)
        await expect(errorContainer).toHaveText(/size/i);
        await expect(errorContainer).toHaveText(/11/); // Перевірка, що згадується цифра 11
    });


    test('TC-03: Previously booked dates show as Unavailable on reservation page', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    
    // 1. Навігація на головну
    await bookingPage.navigate();

    // 2. Обираємо ВІЛЬНІ дати (наприклад, далеке майбутнє), щоб кімната з'явилася в пошуку
    // Використовуємо метод startBookingProcess
    await bookingPage.startBookingProcess('2026-12-01', '2026-12-03');

    // 3. Переходимо до бронювання конкретної кімнати
    await bookingPage.clickFirstRoom();
    
    // 4. Чекаємо завантаження сторінки резервації
    await page.waitForURL(/.*reservation.*/);

    // 5. ПЕРЕВІРКА: Шукаємо той самий елемент "Unavailable" поверх календаря
    // Ми використовуємо локатор по тексту, який знайшли у DOM
    const unavailableLabel = page.locator('.rbc-event-content', { hasText: 'Unavailable' }).first();
    
    // Перевіряємо, що такий елемент існує і видимий
    await expect(unavailableLabel).toBeVisible({ timeout: 10000 });
    
    // Додатково перевіряємо атрибут title
    await expect(unavailableLabel).toHaveAttribute('title', 'Unavailable');
});
});