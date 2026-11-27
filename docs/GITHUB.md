# Загрузка LMS на GitHub

Для этого проекта подходит один репозиторий с frontend и backend. Структуру `src` можно реорганизовать позже отдельным изменением. В текущем состоянии основной сценарий работает, обе сборки проверены. В описании честно указать: учебная LMS с внутренним балансом, без реального платёжного шлюза.

## Что включать

Нужны исходники, `pom.xml`, `package.json`, `package-lock.json`, Maven Wrapper, SQL-миграции, конфигурация сборок, `.env.example` и документация. `node_modules`, `target`, `dist`, `.cache`, `.review`, логи, IDE-файлы и локальные `.env` исключены через `.gitignore`.

Известные значения в `application-local.yaml` и демоаккаунты предназначены только для локального обучения. Реальные секреты и выгрузки пользовательской БД в Git не добавлять. Уже отслеживаемый файл не перестаёт отслеживаться после добавления в `.gitignore`.

## Первая загрузка

Создать на GitHub пустой репозиторий `lms` без автоматического README. Затем:

```powershell
Set-Location -LiteralPath 'C:\Users\artem\Downloads\lms\lms'
git init -b main
git add .
git status --short
git diff --cached --stat
git diff --cached
```

Проверить состав подготовленного коммита, затем:

```powershell
git commit -m "Add working LMS learning workflow"
git remote add origin https://github.com/YOUR_USERNAME/lms.git
git push -u origin main
```

Заменить `YOUR_USERNAME`. Если Git запросит автора, настроить имя и email для этого репозитория. Если `.git` или `origin` уже существуют, сначала посмотреть `git status` и `git remote -v` и использовать существующую настройку.

Шаги соответствуют [официальной инструкции GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github). Автоматически репозиторий не создавался, commit и push не выполнялись.

## Что показать в портфолио

Добавить несколько скриншотов и короткое видео: учитель создаёт курс и урок, публикует, ученик покупает и завершает урок, обновление сохраняет прогресс. Объяснить, что повторная/конкурентная покупка не списывает деньги второй раз, и указать команду воспроизведения тестов из README.

Следующая самостоятельная задача — GitHub Actions с двумя проверками: `npm ci` + `npm run build`, JDK 21 + PostgreSQL 16 на порту 55432 с БД `lms_test` + `mvnw.cmd -B -Ptest-db clean verify`. CI-файл пока не добавлен, успешный CI на GitHub не заявляется. Тестам нельзя передавать реквизиты основной БД.

## Исходники и размещение

GitHub хранит код. Для работающей внешней демонстрации отдельно нужны frontend, Spring Boot и PostgreSQL, а также маршрутизация `/api` и SPA fallback для прямых ссылок на уроки. Порядок локального запуска и ограничения профилей описаны в README. Наличие исходников на GitHub само по себе приложение в интернете не запускает.
