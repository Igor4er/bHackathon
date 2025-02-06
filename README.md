# Ті самі Львівські студенти

## Основні функціональні вимоги
### Реєстрація та авторизація користувачів:
- [ ] Реєстрація через email або соціальні мережі.
- [ ] Створення профілю з аватаром, іменем та історією квестів.

### Створення квестів:
- [ ] Користувач може створювати нові квести, вказуючи назву, опис, кількість завдань та обмеження за часом.
- [ ] Додавання мультимедійних елементів (текст, фото, відео) до завдань.
- [ ] Створення запитань різного типу (відкриті відповіді, тестові питання, пошук об’єктів на зображенні).

### Проходження квестів:
- [ ] Інтерфейс для проходження з інтерактивною картою завдань.
- [ ] Відстеження прогресу користувача в реальному часі.
- [ ] Лічильник часу для завдань з обмеженням.

### Система рейтингу та зворотного зв’язку:
- [ ] Рейтинг авторів квестів.
- [ ] Оцінювання квесту учасниками (зірочки, коментарі).

## Додаткові функціональні вимоги
### Квести в реальному часі:
- [ ] Підтримка групового проходження, де учасники виконують завдання разом або змагаються.
- [ ] Реалізація чату для спілкування під час проходження квесту.

### Геолокація:
- [ ] Завдання, які потребують фізичного відвідування місця (віртуальні тури по містах).

### Гейміфікація:
- [ ] Нагороди за успішне проходження (бейджі, ачивменти).
- [ ] Можливість створення сезонних подій із тематичними квестами.

### Адміністративний модуль:
- [ ] Можливість модераторам переглядати, редагувати та видаляти контент, який порушує правила.

## Технічні вимоги
- [ ] Розгортання на хмарному сервері (Heroku, Vercel, AWS тощо) або використання Docker для зручності розгортання.
- [ ] Інтерактивність через використання WebSocket для оновлення в реальному часі.
- [ ] Репозиторій на GitHub із добре структурованим README, що включає інструкції з запуску.
