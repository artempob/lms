# LMS

Учебный проект платформы онлайн-курсов: регистрация, каталог, создание и публикация курсов, покупка за внутренний баланс и отслеживание прогресса обучения.

**Backend:** Java 21, Spring Boot, Spring Security, Spring Modulith, PostgreSQL, Flyway, JPA, jOOQ.

**Frontend:** React, TypeScript, Vite, TanStack Query, Zustand, React Hook Form, Zod, SCSS Modules, Tailwind CSS.

## Запуск

Требуются JDK 21, Node.js 22.12+ и Docker Desktop. Переменная `JAVA_HOME` должна указывать на JDK 21.

Из корня проекта запустите БД и backend:

```powershell
docker compose up -d --wait postgres
.\mvnw.cmd clean spring-boot:run
```

В другом терминале запустите frontend:

```powershell
npm ci
npm run dev
```

Интерфейс: [localhost:5173](http://localhost:5173). Backend: `localhost:8080`.

## Локальные аккаунты

| Роль | Email | Пароль |
| --- | --- | --- |
| Учитель | teacher@lms.com | teacher |
| Администратор | admin@lms.com | admin |

Ученика можно зарегистрировать через интерфейс. Его начальный баланс — 0; для проверки обучения создайте бесплатный курс. Реальные платежи и пополнение через платёжный сервис не реализованы.

## Конфигурация

По умолчанию включён профиль `local`: БД `localhost:5432/lms`, пользователь `postgres`, пароль `password`. Демоаккаунты создаются только в этом профиле.

Образец переменных — в [.env.example](.env.example). Spring Boot читает переменные окружения, но не загружает `.env` автоматически. Для внешнего запуска задайте `SPRING_PROFILES_ACTIVE=prod`, `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` и `LMS_ALLOWED_ORIGINS`.

## Проверки

```powershell
docker compose --profile test up -d --wait postgres-test
.\mvnw.cmd -B -Ptest-db clean verify
npm run build
docker compose --profile test stop postgres-test
```

Тесты используют отдельную БД `localhost:55432/lms_test` и очищают её данные.
