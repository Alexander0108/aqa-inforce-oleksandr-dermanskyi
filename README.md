# AQA Inforce Task — Oleksandr Dermanskyi

Automated testing project for the Restful Booker Platform.

## 📁 Project Structure
* `test-cases.txt` — Manual test cases (Part 1).
* `tests/booking.spec.js` — UI automation for booking flows.
* `tests/api-room.spec.js` — API automation for room management (CRUD).
* `pages/BookingPage.js` — Page Object Model implementation.

## 🛠 Setup & Execution
1. Install dependencies:
    npm install

2. Run all tests:
    npx playwright test

3. View results:
    npx playwright show-report

⚠️ Technical Note (Technical details on Part 2)
English:
Hybrid API Authentication
The API automation tests in api-room.spec.js use a hybrid approach. The script performs a UI-based login in the beforeAll hook to capture the authorization token (token cookie) via session interception. This ensures that subsequent REST API calls (POST/PUT/DELETE) are performed with valid credentials without hardcoding static tokens.

Environment & Stability
Serial Mode: API tests are configured to run in serial mode to maintain data integrity during the Create -> Edit -> Delete flow.

WebKit Note: During execution, a timeout might occasionally occur in the WebKit environment for TC-03. This is a known environmental issue related to the rendering of the React Big Calendar component on the demo platform. The core logic is verified and stable in Chromium and Firefox.

API Reliability: The testing environment (automationintesting.online) occasionally returns 403/404 errors for valid requests. The framework includes basic error handling and logging to monitor these cases.

Українською:
Гібридна автентифікація API
Тести автоматизації API в api-room.spec.js використовують гібридний підхід. Скрипт виконує вхід на основі інтерфейсу користувача в хуку beforeAll, щоб захопити токен авторизації (cookie токена) шляхом перехоплення сеансу. Це гарантує, що наступні виклики REST API (POST/PUT/DELETE) будуть виконані з дійсними обліковими даними без жорсткого кодування статичних токенів.

Середовище та стабільність
Послідовний режим: Тести API налаштовані на виконання в послідовному режимі для збереження цілісності даних під час потоку Створення -> Редагування -> Видалення.

Примітка WebKit: Під час виконання в середовищі WebKit для TC-03 іноді може виникати тайм-аут. Це відома проблема середовища, пов'язана з рендерингом компонента React Big Calendar на демонстраційній платформі. Основна логіка перевірена та стабільна в Chromium та Firefox.

Надійність API: Тестове середовище (automationintesting.online) іноді повертає помилки 403/404 для дійсних запитів. Фреймворк включає базову обробку помилок та ведення журналу для моніторингу цих випадків.