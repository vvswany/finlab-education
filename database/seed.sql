INSERT INTO modules(number,title,description,slug) VALUES
(1,'Деньги','Разбираемся, как считать стоимость денег и повседневных решений.','money'),
(2,'Проценты','Используем проценты не в вакууме, а в реальных финансовых ситуациях.','percentages'),
(3,'Бюджет','Планируем доходы, расходы и финансовые цели.','budget'),
(4,'Кредиты','Считаем переплату и сравниваем условия займа.','credit'),
(5,'Инвестиции','Исследуем доходность, риск и время.','investments'),
(6,'Решения','Собираем расчёты вместе и принимаем финансовые решения.','decisions')
ON CONFLICT(number) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,slug=EXCLUDED.slug;
