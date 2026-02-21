import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Part 2: API Automation Flow', () => {
    let roomId;
    let authHeader;
    // Генеруємо унікальне ім'я (наприклад "9432")
    const uniqueRoomName = Math.floor(1000 + Math.random() * 9000).toString();

    test.beforeAll(async ({ playwright }) => {
        const browser = await playwright.chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            console.log('--- UI Login Process Started ---');
            await page.goto('https://automationintesting.online/admin');
            
            await page.locator('#username').fill('admin');
            await page.locator('#password').fill('password');
            await page.getByRole('button', { name: 'Login' }).click();

            // Чекаємо Logout
            const logoutBtn = page.getByRole('button', { name: 'Logout' });
            await expect(logoutBtn).toBeVisible({ timeout: 10000 });
            
            await page.screenshot({ path: 'debug-admin-panel.png' }); // Скріншот після входу
            console.log('Login Status: Success. Screenshot saved.');

            const cookies = await context.cookies();
            const tokenCookie = cookies.find(c => c.name === 'token');
            authHeader = `token=${tokenCookie.value}`;
        } catch (error) {
            await page.screenshot({ path: 'debug-login-failed.png' });
            console.error('Login failed:', error.message);
            throw error;
        } finally {
            await browser.close();
        }
    });

    test('1. Create Room via API', async ({ request }) => {
        // 1. Відправляємо запит на створення
        const response = await request.post('https://automationintesting.online/api/room', {
            data: {
                roomName: uniqueRoomName,
                type: "Single",
                accessible: true,
                roomPrice: "300",
                features: ["WiFi"],
                description: `Unique ID: ${uniqueRoomName}`,
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg"
            },
            headers: { 
                'Cookie': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        expect(response.status()).toBe(200);
        console.log('Room creation request sent. Success: true');

        // 2. Тепер робимо GET запит, щоб знайти нашу кімнату в загальному списку
        const getRooms = await request.get('https://automationintesting.online/api/room');
        const body = await getRooms.json();

        // 3. Шукаємо нашу кімнату за унікальним іменем серед усіх існуючих
        const createdRoom = body.rooms.find(r => r.roomName === uniqueRoomName);
        
        if (createdRoom) {
            roomId = createdRoom.roomid;
            console.log(`Bingo! Found our room in the list. Name: ${uniqueRoomName}, ID: ${roomId}`);
        } else {
            console.log('Available rooms in list:', body.rooms.map(r => r.roomName));
            throw new Error(`Room with name ${uniqueRoomName} was not found in the list after creation.`);
        }

        expect(roomId).toBeDefined();
    });

    test('2. Edit Room via API', async ({ request }) => {
        const update = await request.put(`https://automationintesting.online/api/room/${roomId}`, {
            data: {
                roomName: uniqueRoomName,
                type: "Double",
                accessible: true,
                roomPrice: "999",
                features: ["WiFi", "TV"],
                description: "Updated description",
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg"
            },
            headers: { 'Cookie': authHeader }
        });

        expect(update.ok()).toBeTruthy();
        console.log(`Room ${roomId} updated to price 999`);
    });

    test('3. Delete Room via API', async ({ request }) => {
        const deleted = await request.delete(`https://automationintesting.online/api/room/${roomId}`, {
            headers: { 'Cookie': authHeader }
        });

        // Міняємо 202 на 200, бо сервер каже "ОК"
        expect(deleted.status()).toBe(200); 
        console.log(`Room ${roomId} deleted successfully`);
    });
});